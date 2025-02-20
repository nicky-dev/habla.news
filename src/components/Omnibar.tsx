import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/navigation";
import throttle from "lodash/throttle";
import {
  useDisclosure,
  Spinner,
  Stack,
  Heading,
  Text,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { nip05, nip19 } from "nostr-tools";

import { LONG_FORM, HIGHLIGHT, HASHTAG_REGEX } from "@habla/const";
import { urlsToNip27 } from "@habla/nip27";
import Feed from "@habla/components/nostr/Feed";
import SearchIcon from "@habla/icons/Search";

export default function Omnibar() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [event, setEvent] = useState();
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tags, setTags] = useState([]);
  const isTagSearch = tags?.length > 0;

  const onSearchChange = useCallback(
    throttle(async () => {
      const newContent = urlsToNip27(search).replace(/^nostr:/, "");

      try {
        const decoded = nip19.decode(newContent);
        if (decoded?.type === "npub") {
          return await router.push(`/p/${newContent}`, undefined, {
            shallow: true,
          });
        } else if (decoded?.type === "nprofile") {
          return await router.push(`/p/${newContent}`, undefined, {
            shallow: true,
          });
        } else if (decoded?.type === "note") {
          return await router.push(`/n/${newContent}`, undefined, {
            shallow: true,
          });
        } else if (decoded?.type === "nevent") {
          return await router.push(`/e/${newContent}`, undefined, {
            shallow: true,
          });
        } else if (decoded?.type === "naddr") {
          return await router.push(`/a/${newContent}`, undefined, {
            shallow: true,
          });
        } else if (decoded?.type === "nrelay") {
          return await router.push(`/r/${newContent}`, undefined, {
            shallow: true,
          });
        }
      } catch (error) {}

      try {
        onOpen();
        const profile = await nip05.queryProfile(newContent);
        if (profile) {
          return await router.push(`/u/${newContent}`, undefined, {
            shallow: true,
          });
        }
      } catch (error) {
      } finally {
        onClose();
      }

      const hashtags = newContent.match(HASHTAG_REGEX);
      if (hashtags) {
        setTags(hashtags.map((t) => t.slice(1)));
      }
    }, 500),
    [search]
  );

  useEffect(() => {
    onSearchChange();
  }, [search]);

  return (
    <Stack gap={2}>
      <Heading>{t("search")}</Heading>
      <Text>{t("search-description")}</Text>
      <Text>{t("search-more")}</Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          {isOpen ? (
            <Spinner size="xs" color="secondary" />
          ) : (
            <Icon as={SearchIcon} color="secondary" />
          )}
        </InputLeftElement>
        <Input
          autoFocus
          placeholder={t("search-placeholder")}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      {isTagSearch && (
        <Feed
          key={tags.join("")}
          filter={{ kinds: [LONG_FORM], "#t": tags }}
          options={{
            cacheUsage: "PARALLEL",
            closeOnEose: true,
          }}
        />
      )}
      // todo: add when it works
      {!isTagSearch && search?.length > 2 && (
        <Feed
          key={search}
          filter={{ kinds: [LONG_FORM], search }}
          options={{
            cacheUsage: "ONLY_CACHE",
          }}
        />
      )}
    </Stack>
  );
}
