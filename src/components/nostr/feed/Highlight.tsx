import { useMemo } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import "zapthreads";

import {
  Flex,
  Heading,
  Text,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";

import { nip19 } from "nostr-tools";

import { ZAP, REPOST, NOTE } from "@habla/const";
import useSeenOn from "@habla/hooks/useSeenOn";
import NAddr from "@habla/markdown/Naddr";
import { useEvent } from "@habla/nostr/hooks";
import { findTag } from "@habla/tags";
import ArticleTitle from "@habla/components/nostr/ArticleTitle";
import Blockquote from "@habla/components/Blockquote";
import User from "@habla/components/nostr/User";
import Reactions from "@habla/components/nostr/LazyReactions";
import EventId from "@habla/markdown/EventId";
import ExternalLink from "@habla/components/ExternalLink";
import { useAtom } from "jotai";
import { pubkeyAtom, relaysAtom } from "@habla/state";

const HighlightSubstring = ({ text, substring }) => {
  const startIndex = text.indexOf(substring);
  const endIndex = startIndex + substring.length;

  if (startIndex === -1) {
    // Substring not found in the text
    return <>{text}</>;
  }

  const beforeSubstring = text.slice(0, startIndex);
  const markedSubstring = text.slice(startIndex, endIndex);
  const afterSubstring = text.slice(endIndex);

  return (
    <>
      {beforeSubstring}
      <mark>{markedSubstring}</mark>
      {afterSubstring}
    </>
  );
};

export default function Highlight({
  event,
  showHeader = true,
  showReactions = true,
  ...props
}) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const a = findTag(event, "a");
  const e = findTag(event, "e");
  const r = findTag(event, "r");
  const context = findTag(event, "context");
  const seenOn = useSeenOn(event);
  const [kind, pubkey, identifier] = a?.split(":") ?? [];
  const [loggedInPubkey] = useAtom(pubkeyAtom);
  const [defaultRelays] = useAtom(relaysAtom);
  const nevent = useMemo(() => {
    if (event.id) {
      return nip19.neventEncode({
        id: event.id,
        author: event.pubkey,
        relays: seenOn,
      });
    }
  }, [event, seenOn]);
  const naddr = useMemo(() => {
    if (kind && pubkey && identifier) {
      return nip19.naddrEncode({
        identifier,
        pubkey,
        kind: Number(kind),
        relays: seenOn,
      });
    }
  }, [kind, pubkey, identifier]);

  const { colorMode } = useColorMode();

  return event.content.length < 4200 ? (
    <Card variant="highlight" key={event.id} ref={ref} my={4} {...props}>
      {showHeader && (
        <CardHeader>
          <User pubkey={event.pubkey} />
        </CardHeader>
      )}
      <CardBody dir="auto">
        <Stack gap="1">
          {!e && (
            <Blockquote style={{ margin: 0 }}>
              {context && context.length > event.content.length + 1 ? (
                <HighlightSubstring text={context} substring={event.content} />
              ) : (
                event.content
              )}
            </Blockquote>
          )}
          {e && <EventId id={e} highlights={[event]} my={0} />}
          {naddr && (
            <ArticleTitle
              naddr={naddr}
              kind={Number(kind)}
              identifier={identifier}
              pubkey={pubkey}
              fontFamily="'Inter'"
              fontWeight={600}
              fontSize="sm"
              color="secondary"
            />
          )}
          {r && !naddr && !r.startsWith("https://habla.news") && (
            <ExternalLink href={r}>
              <Text
                fontFamily="'Inter'"
                fontWeight={600}
                fontSize="sm"
                color="secondary"
              >
                {r}
              </Text>
            </ExternalLink>
          )}
        </Stack>
      </CardBody>
      {showReactions && (
        <>
          <CardFooter dir="auto">
            <Flex alignItems="center" justifyContent="space-between" width="100%">
              <Reactions
                event={event}
                kinds={[ZAP, REPOST, NOTE]}
                live={inView}
              />
              <Link href={`/e/${nevent}`} shallow>
                <Icon
                  as={LinkIcon}
                  boxSize={3}
                  color="secondary"
                  cursor="pointer"
                />
              </Link>
            </Flex>
          </CardFooter>
          <style>{
            colorMode == 'light' ? `
            :root {
              --ztr-font: Inter;
              --ztr-text-color: #2B2B2B;
              --ztr-textarea-color: #2B2B2B;
              --ztr-icon-color: #656565;
              --ztr-link-color:  #92379c;
              --ztr-login-button-color: var(--chakra-colors-orange-500);
              --ztr-background-color: rgba(0, 0, 0, 0.03);
            }
          ` : `
            :root {
              --ztr-font: Inter;
              --ztr-text-color: #dedede;
              --ztr-icon-color: #656565;
              --ztr-link-color: #e4b144;
              --ztr-login-button-color: #5e584b;
              --ztr-background-color: rgba(255, 255, 255, 0.05);
            }
          `}
          </style>
          <zap-threads
            anchor={nevent}
            pubkey={loggedInPubkey}
            relays={defaultRelays}
            disable-likes={true}
            disable-zaps={true}
            disable-publish={true}
          />
        </>
      )}
    </Card>
  ) : null;
}
