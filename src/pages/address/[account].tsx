import {
  Container,
  Center,
  Heading,
  Divider,
  Box,
  Badge,
  Stack,
  Text,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useAccount } from "../../hooks/useAccount";
import { useRouter } from "next/router";

type AccountInfoParsed = {
  parsed: {
    info: {
      isNative: boolean;
      mint: string;
      owner: string;
      state: string;
    };
    type: string;
  };
  program: string;
  space: number;
};

const SplTokenAccount = (params: { info: any }) => {
  const { info } = params;
  return (
    <>
      <Text>SPL Token Account</Text>
      <Stat>
        <StatLabel color={"teal"}>Mint</StatLabel>
        <StatHelpText>
          <Link href={`/address/${info.mint}`}>{info.mint}</Link>
        </StatHelpText>
        <StatLabel color={"teal"}>Owner</StatLabel>
        <StatHelpText>
          <Link href={`/address/${info.owner}`}>{info.owner}</Link>
        </StatHelpText>
        <StatLabel color={"teal"}>State</StatLabel>
        <StatHelpText>{info.state}</StatHelpText>
      </Stat>
    </>
  );
};

const SplTokenMint = (params: { info: any }) => {
  const { info } = params;
  return (
    <>
      <Text>SPL Token Mint</Text>
      <Stat>
        <StatLabel color={"teal"}>Decimals</StatLabel>
        <StatHelpText>{info.decimals}</StatHelpText>
        <StatLabel color={"teal"}>Mint Authority</StatLabel>
        <StatHelpText>
          <Link href={`/address/${info.freezeAuthority}`}>
            {info.freezeAuthority}
          </Link>
        </StatHelpText>
        <StatLabel color={"teal"}>Freeze Authority</StatLabel>
        <StatHelpText>
          <Link href={`/address/${info.mintAuthority}`}>
            {info.mintAuthority}
          </Link>
        </StatHelpText>
      </Stat>
    </>
  );
};

const AccountDataParsed = (params: { parsedInfo: AccountInfoParsed }) => {
  const { parsedInfo } = params;
  return (
      <Stack marginLeft={10} direction={"column"}>
        {parsedInfo.program === "spl-token" &&
          parsedInfo.parsed.type === "account" && (
            <SplTokenAccount info={parsedInfo.parsed.info} />
          )}
        {parsedInfo.program === "spl-token" &&
          parsedInfo.parsed.type === "mint" && (
            <SplTokenMint info={parsedInfo.parsed.info} />
          )}
      </Stack>
  );
};

const AccountDetails: NextPage = () => {
  const router = useRouter();
  const { accountInfo } = useAccount(router?.query?.account as string);
  const isProgram = accountInfo?.value?.executable;

  return (
    <Container maxW={1200} marginTop={0}>
      <Center>
        <Heading
          role="heading"
          as="h1"
          color="white"
          borderRadius={4}
          mt={8}
          p={4}
          bg="#008080"
        >
          <Link href="/">Solana DevNet Explorer 🤙🤙🤙</Link>
        </Heading>
      </Center>

      <Center marginBottom={10} marginTop={5}>
        <Box>
          <Heading>{isProgram ? "Program" : "Account"}</Heading>
          <Badge colorScheme="red">
            <Text fontSize={24}>{router?.query?.account}</Text>
          </Badge>
          <Divider />
          <Stat marginTop={5}>
            <StatLabel color={"teal"}>Owner</StatLabel>
            <StatNumber>
              <Link
                color="red.500"
                href={`/address/${accountInfo?.value?.owner}`}
              >
                {accountInfo?.value?.owner}
              </Link>
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel color={"teal"}>SOL</StatLabel>
            <StatNumber>
              {(Number(accountInfo?.value?.lamports) / 1000000000).toFixed(9)}
            </StatNumber>
          </Stat>
          <Divider />
        </Box>
        {accountInfo?.value?.data?.parsed && (
          <AccountDataParsed parsedInfo={accountInfo?.value?.data} />
        )}
      </Center>
    </Container>
  );
};

export default AccountDetails;
