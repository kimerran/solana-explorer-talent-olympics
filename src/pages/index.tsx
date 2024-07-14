import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  Heading,
  Box,
  Center,
  UnorderedList,
  ListItem,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Badge,
  Stack,
  Tooltip,
  Text,
  Code,
  Input,
} from "@chakra-ui/react";
import {
  EpochInfoParams,
  TransactionTableParams,
  useSolanaBlockchain,
} from "../hooks/useSolana";
import {
  TimeIcon,
  StarIcon,
  TriangleDownIcon,
  TriangleUpIcon,
  SmallAddIcon,
} from "@chakra-ui/icons";

type Routes = {
  text: string;
  route: string;
};

const EpochInfoTable = (epochInfo: EpochInfoParams) => {
  if (!epochInfo) return <>loading...</>;
  return (
    <>
      <Box>
        <Stack direction={"row"}>
          <Badge colorScheme="blue">
            <Tooltip hasArrow label={`Epoch`}>
              <Text>
                <TimeIcon /> {epochInfo?.epochInfo?.epoch}
              </Text>
            </Tooltip>
          </Badge>
          <Badge colorScheme="pink">
            <Tooltip hasArrow label={`Block Height`}>
              <Text>
                <TriangleUpIcon /> {epochInfo?.epochInfo?.blockHeight} SOL
              </Text>
            </Tooltip>
          </Badge>
          <Badge colorScheme="yellow">
            <Tooltip hasArrow label={`Transaction Count`}>
              <Text>
                <SmallAddIcon /> {epochInfo?.epochInfo?.transactionCount}
              </Text>
            </Tooltip>
          </Badge>
        </Stack>
      </Box>
    </>
  );
};

const TransactionTable = (params: TransactionTableParams) => {
  const { transactions } = params;

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Transactions</Th>
            <Th>Fee</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions?.map((tx) => {
            const feeInSol = Number(tx.meta.fee) / 1000000000;

            return (
              <Tr key={tx.id}>
                <Td>
                  <Link color="red" href={`tx/${tx.transaction.signatures[0]}`}>
                    <Text fontFamily={"courier new"} fontSize={10}>
                      {tx.transaction.signatures[0]}
                    </Text>
                  </Link>
                </Td>
                <Td>
                  <Stack direction={"row"}>
                    <Text fontFamily={"courier new"} fontSize={10}>
                      {feeInSol} SOL
                    </Text>
                  </Stack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const Home: NextPage = () => {
  const { epochInfo, blockInfo } = useSolanaBlockchain();

  console.log("epochInfo", epochInfo);
  console.log("blockInfo", blockInfo);

  return (
    <div>
      {/* <Head>
        <title>Solana DevNet Explorer for Talent Olympics</title>
        <meta name="description" content="Solana Devnet Explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <Box>
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
        <Center paddingBottom={10} marginTop={5}>
          <Input
            maxWidth={500}
            placeholder="Search DevNet Transaction ex. 32o3ZzfxzLjH3cufaUB91ERaBBRkqWTZHYuUtuMFS8ooaVT8FttfzEh3V3eaSfZ3rK6TYwzyu7KELfMGhbRv3NJV"
            size="lg"
            onKeyDown={(e) => {
              if (e.key ==='Enter') {
                window.location.href = "/tx/" + e.currentTarget.value;
              }
            }}
          />
        </Center>
        <Center>
          <EpochInfoTable epochInfo={epochInfo!} />
        </Center>

        <Box>
          <Center>
            <TransactionTable transactions={blockInfo?.transactions} />
          </Center>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
