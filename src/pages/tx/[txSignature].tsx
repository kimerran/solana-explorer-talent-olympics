import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTransaction } from "../../hooks/useTransaction";
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
import { Head } from "next/document";

type InstructionType = {
  program?: string;
  programId: string;
  info?: {
    amount: string;
    authority: string;
    destination: string;
    source: string;
  };
  parsed?: {
    type: string;
  };
};
type TransactionTableParams = {
  instructions: InstructionType[];
};

type TxInfoType = {
  transaction: {
    message: any;
    signatures: string[];
  };
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

          {/* <Tooltip  hasArrow label={toopTipDetails}>
            <InfoIcon />
          </Tooltip> */}
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

  console.log("instructions", instructions);
  return (
    <>
      {instructions?.map((i) => {
        // const parsedInfo = i.parsed?.info || {};
        return <InstructionDetailCard key={i} ins={i} />;
        // return (
        //   <Tr>
        //     <Td>{i.program || i.programId}</Td>
        //     <Td>{i.parsed?.type || "NA"}</Td>
        //     <Td>
        //         <InstructionDetailCard ins={i} />
        //       {/* {parsedInfo && (
        //         <VStack direction={"row"}>
        //           {Object.keys(parsedInfo).map((key) => {
        //             let value: string = parsedInfo[key];
        //             if (typeof parsedInfo === "object") {
        //               value = JSON.stringify(value, null, 2);
        //             }

        //             return (
        //               <Code maxWidth={250}>
        //                 {key}:{`${value.substring(0, 250)}`}
        //               </Code>
        //             );
        //           })}
        //         </VStack> */}

        //     </Td>
        //   </Tr>
        // );
      })}
    </>
  );
};

const TxSignatureDetails: NextPage = () => {
  const router = useRouter();
  const [instructionsData, setInstructionData] = useState();

  console.log("router.queery", router.query);

  const [txInfo] = useTransaction(router?.query?.txSignature as string);
  console.log("txInfo", txInfo);

  // const { result } = txInfo;

  useEffect(() => {
    // check if innerInstructions lenght is more
    if (txInfo) {
      const {
        result: {
          meta: { innerInstructions },
        },
      } = txInfo;
      const {
        result: {
          transaction: {
            message: { instructions },
          },
        },
      } = txInfo;

      console.log(">> innerInstructions", innerInstructions);
      console.log(">> insturctions", instructions);

      if (innerInstructions.length > 0) {
        //. flatten
        const flattenInstructions = innerInstructions.flatMap(
          (i) => i.instructions
        );
        console.log(">> flattenInstructions", flattenInstructions);
        setInstructionData(flattenInstructions);
      } else if (instructions.length > 0) {
        setInstructionData(instructions);
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
        {txInfo && <TxInfoCard tx={txInfo.result} />}
      </Box>

      <Box>
        <Text fontSize={32}>Instructions</Text>
        {txInfo && <InstructionsTable instructions={instructionsData} />}

        {/* <Card maxW={800}>
          <CardBody>
            <Stack>
              <Heading>vote</Heading>
              <Badge>compactupdatevotestate</Badge>
            </Stack>
          </CardBody>
        </Card> */}
      </Box>
      {/*  */}
    </Container>
  );
};

export default TxSignatureDetails;
