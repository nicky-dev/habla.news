import { useMemo } from "react";
import { useRouter } from "next/router";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import {
  Flex,
  IconButton,
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { nip19 } from "nostr-tools";

import Markdown from "@habla/markdown/Markdown";
import User from "../User";

export default function Note({ event, highlights = [], ...props }) {
  const router = useRouter();
  const nevent = useMemo(() => {
    return nip19.neventEncode({
      id: event.id,
      author: event.pubkey,
    });
  }, [event]);
  return (
    <Card variant="outline" my={4} {...props}>
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <User pubkey={event.pubkey} size="sm" />
          <IconButton
            cursor="pointer"
            variant="unstyled"
            boxSize={3}
            color="secondary"
            as={LinkIcon}
            onClick={() => router.push(`https://snort.social/e/${nevent}`)}
          />
        </Flex>
      </CardHeader>
      <CardBody px={"60px"} dir="auto" pt={0} wordBreak="break-word">
        <Prose>
          <Markdown
            content={event.content}
            tags={event.tags}
            highlights={highlights}
          />
        </Prose>
      </CardBody>
    </Card>
  );
}
