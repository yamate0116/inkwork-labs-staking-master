import { web3 } from "@project-serum/anchor";
import { programs } from "@metaplex/js";
import { NETWORK } from "../config";
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  Transaction,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  MintLayout,
} from "@solana/spl-token";
import { errorAlert } from "../components/toastGroup";

export const solConnection = new web3.Connection(web3.clusterApiUrl(NETWORK));

export const getNftMetaData = async (nftMintPk: PublicKey) => {
  let {
    metadata: { Metadata },
  } = programs;
  let metadataAccount = await Metadata.getPDA(nftMintPk);
  const metadata = await Metadata.load(solConnection, metadataAccount);
  return metadata.data.data.uri;
};

export const METAPLEX = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const getOwnerOfNFT = async (
  nftMintPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  let tokenAccountPK = await getNFTTokenAccount(nftMintPk, connection);
  let tokenAccountInfo = await connection.getAccountInfo(tokenAccountPK);

  console.log("nftMintPk=", nftMintPk.toBase58());
  console.log("tokenAccountInfo =", tokenAccountInfo);

  if (tokenAccountInfo && tokenAccountInfo.data) {
    let ownerPubkey = new PublicKey(tokenAccountInfo.data.slice(32, 64));
    console.log("ownerPubkey=", ownerPubkey.toBase58());
    return ownerPubkey;
  }
  return new PublicKey("");
};

export const getTokenAccount = async (
  mintPk: PublicKey,
  userPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  let tokenAccount = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 0,
          bytes: mintPk.toBase58(),
        },
      },
      {
        memcmp: {
          offset: 32,
          bytes: userPk.toBase58(),
        },
      },
    ],
  });
  return tokenAccount[0].pubkey;
};

export const getNFTTokenAccount = async (
  nftMintPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  console.log("getNFTTokenAccount nftMintPk=", nftMintPk.toBase58());
  let tokenAccount = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 64,
          bytes: "2",
        },
      },
      {
        memcmp: {
          offset: 0,
          bytes: nftMintPk.toBase58(),
        },
      },
    ],
  });
  return tokenAccount[0].pubkey;
};

export const getAssociatedTokenAccount = async (
  ownerPubkey: PublicKey,
  mintPk: PublicKey
): Promise<PublicKey> => {
  let associatedTokenAccountPubkey = (
    await PublicKey.findProgramAddress(
      [
        ownerPubkey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPk.toBuffer(), // mint address
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
  return associatedTokenAccountPubkey;
};

export const getATokenAccountsNeedCreate = async (
  connection: Connection,
  walletAddress: PublicKey,
  owner: PublicKey,
  nfts: PublicKey[]
) => {
  let instructions = [],
    destinationAccounts = [];
  for (const mint of nfts) {
    const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
    const response = await connection.getAccountInfo(destinationPubkey);
    if (!response) {
      const createATAIx = createAssociatedTokenAccountInstruction(
        destinationPubkey,
        walletAddress,
        owner,
        mint
      );
      instructions.push(createATAIx);
    }
    destinationAccounts.push(destinationPubkey);
  }
  return {
    instructions,
    destinationAccounts,
  };
};

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

/** Get metaplex mint metadata account address */
export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from("metadata"), METAPLEX.toBuffer(), mint.toBuffer()],
      METAPLEX
    )
  )[0];
};

export const airdropSOL = async (
  address: PublicKey,
  amount: number,
  connection: Connection
) => {
  try {
    const txId = await connection.requestAirdrop(address, amount);
    await connection.confirmTransaction(txId);
  } catch (e) {
    console.log("Aridrop Failure", address.toBase58(), amount);
  }
};

export const createTokenMint = async (
  connection: Connection,
  payer: Keypair,
  mint: Keypair
) => {
  const ret = await connection.getAccountInfo(mint.publicKey);
  if (ret && ret.data) {
    console.log("Token already in use", mint.publicKey.toBase58());
    return;
  }
  // Allocate memory for the account
  const balanceNeeded = await Token.getMinBalanceRentForExemptMint(connection);
  const transaction = new Transaction();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: balanceNeeded,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  transaction.add(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      9,
      payer.publicKey,
      payer.publicKey
    )
  );
  const txId = await connection.sendTransaction(transaction, [payer, mint]);
  await connection.confirmTransaction(txId);

  console.log("Tx Hash=", txId);
};

export const isExistAccount = async (
  address: PublicKey,
  connection: Connection
) => {
  try {
    const res = await connection.getAccountInfo(address);
    if (res && res.data) return true;
  } catch (e) {
    return false;
  }
};

export const getTokenAccountBalance = async (
  account: PublicKey,
  connection: Connection
) => {
  try {
    const res = await connection.getTokenAccountBalance(account);
    if (res && res.value) return res.value.uiAmount;
    return 0;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const filterError = (error: any) => {
  if (error.message) {
    const errorCode = parseInt(
      error.message.split("custom program error: ")[1]
    );
    // "custom program error: "
    switch (errorCode) {
      case 6000:
        errorAlert("Invalid Super Owner");
        break;
      case 6001:
        errorAlert("Invalid Global Pool Address");
        break;
      case 6002:
        errorAlert("Invalid User Pool Owner Address");
        break;
      case 6003:
        errorAlert("Invalid Withdraw Time");
        break;
      case 6004:
        errorAlert("Not Found Staked Mint");
        break;
      case 6005:
        errorAlert("Insufficient Reward Token Balance");
        break;
      case 6006:
        errorAlert("Insufficient Account Token Balance");
        break;
      case 6007:
        errorAlert("Invalid Metadata Address");
        break;
      case 6008:
        errorAlert("Can't Parse The NFT's Creators");
        break;
      case 6009:
        errorAlert("Unknown Collection Or The Collection Is Not Allowed");
        break;
      default:
        break;
    }
  }
  if (error?.code === 4001) {
    errorAlert("User rejected the request.");
  }
  if (error?.code === -32603) {
    errorAlert("Something went wrong.");
  }
};

export const getMarketPlaceInfo = async () => {
  var axios = require("axios");

  var config = {
    method: "get",
    url: "https://api-mainnet.magiceden.dev/v2/collections/airia/stats",
    headers: {},
  };

  const floorPrice = await axios(config)
    .then(function (response: any) {
      return response.data?.floorPrice / LAMPORTS_PER_SOL;
    })
    .catch(function (error: any) {
      console.log(error);
      return 0;
    });

  const solPrice = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
  )
    .then((resp) => resp.json())
    .catch((e) => {
      return 0;
    })
    .then((json) => {
      return json["solana"].usd;
    });
  return floorPrice * solPrice;
};
