import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { v7 as newId } from "uuid";
import { InstructionType, TxInfoType, useTransaction } from "../../hooks/useTransaction";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Code,
  Stack,
  VStack,
  Box,
  Container,
  Text,
  CardBody,
  Card,
  Divider,
  Heading,
  Badge,
  IconButton,
  Tooltip,
  Textarea,
  Center,
} from "@chakra-ui/react";
import Link from "next/link";
import { isObject } from "util";
import {
  ChevronRightIcon,
  InfoIcon,
  StarIcon,
  TimeIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";

type TransactionTableParams = {
  instructions: (InstructionType | undefined)[];
};

const InstructionDetailCard = (params: { ins: InstructionType }) => {
  const { ins } = params;

  let toopTipDetails: string = "";
  const parsedInfo = ins.parsed?.info;
  if (parsedInfo) {
    toopTipDetails = JSON.stringify(parsedInfo, null, 4);
  } else if (ins.accounts) {
    toopTipDetails = `accounts: ${ins.accounts.join("\n")} 
        \ndata : ${ins.data}
        `;
  }

  return (
    <Card maxW={800} marginBottom={2}>
      <CardBody>
        {/* <IconButton aria-label="Search database" icon={<TriangleUpIcon />} /> */}
        <Stack direction={"row"} alignContent={"initial"}>
          <Text>
            {ins.program && (
              <Badge colorScheme="purple">Program: {ins.program}</Badge>
            )}
            <Badge colorScheme="green">Program Id: {ins.programId}</Badge>
          </Text>
          <Text>
            <Badge>{ins.parsed?.type}</Badge>
            <Textarea width={300} fontSize={10} value={toopTipDetails} disabled>
              asdas
            </Textarea>
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

const TxInfoCard = (params: { tx: TxInfoType }) => {
  const { tx } = params;
  const feeInSol = Number(tx.meta.fee) / 1000000000;

  return (
    <>
      <Stack direction={"row"} marginBottom={2}>
        <Badge colorScheme="red">
          <Tooltip
            hasArrow
            label={`Tx Signature: ${tx.transaction.signatures[0]}`}
          >
            <Text>
              <ChevronRightIcon /> {tx.transaction.signatures[0]}
            </Text>
          </Tooltip>
        </Badge>
      </Stack>
      <Stack direction={"row"}>
        <Badge colorScheme="blue">
          <Tooltip hasArrow label={`Block Time: ${tx.blockTime}`}>
            <Text>
              <TimeIcon /> {tx.blockTime}
            </Text>
          </Tooltip>
        </Badge>
        <Badge colorScheme="pink">
          <Tooltip hasArrow label={`Fee: ${feeInSol} SOL`}>
            <Text>
              <StarIcon /> {feeInSol} SOL
            </Text>
          </Tooltip>
        </Badge>
        <Badge colorScheme="yellow">
          <Tooltip hasArrow label={`Slot Time: ${tx.slot}`}>
            <Text>
              <TriangleDownIcon /> {tx.slot}
            </Text>
          </Tooltip>
        </Badge>
      </Stack>
    </>
  );
};

const InstructionsTable = (params: TransactionTableParams) => {
  const { instructions } = params;

  return (
    <>
      {instructions?.map((i) => {
        return <InstructionDetailCard key={i?.id} ins={i!} />;
      })}
    </>
  );
};

const TxSignatureDetails: NextPage = () => {
  const router = useRouter();
  const [instructionsData, setInstructionData] = useState<(InstructionType | undefined)[]>();
  const [txInfo] = useTransaction(router?.query?.txSignature as string);

  useEffect(() => {
    // check if innerInstructions lenght is more
    if (txInfo) {
      const {
        meta: { innerInstructions },
      } = txInfo;
      const {
        transaction: {
          message: { instructions },
        },
      } = txInfo;

      const addIds = (instructions: InstructionType[]) => {
        return instructions.map((ins) => {
          return Object.assign({}, ins, { id: newId()})
        })
      }

      if (innerInstructions.length > 0) {
        const flattenInstructions = innerInstructions.flatMap(
          (i) => i.instructions || []
        );
        console.log(">> flattenInstructions", flattenInstructions);
        setInstructionData(addIds(flattenInstructions));
      } else if (instructions.length > 0) {
        
        setInstructionData(addIds(instructions));
      }
    }
  }, [txInfo]);

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
          <Link href="/">
          Solana DevNet Explorer 🤙🤙🤙

          </Link>
        
        </Heading>
      </Center>

      <Box paddingBottom={5} marginTop={5}>
        <Heading>Transaction</Heading>

        <Divider />
        {txInfo && <TxInfoCard tx={txInfo} />}
      </Box>

      <Box>
        <Text fontSize={32}>Instructions</Text>
        {txInfo && <InstructionsTable instructions={instructionsData!} />}
      </Box>
    </Container>
  );
};

export default TxSignatureDetails;
