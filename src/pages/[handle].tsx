import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Flex, Stack } from "@chakra-ui/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import Markdown from "@habla/markdown/Markdown";
import Layout from "@habla/layouts/Wide";
import { getHandles, getPubkey } from "@habla/nip05";
import { getProfile, getEvents } from "@habla/db";
import User from "@habla/components/User";
import { useNdk } from "@habla/nostr/hooks";

import FollowButton from "@habla/components/nostr/FollowButton";
import UserContent from "@habla/components/nostr/UserContent";

export default function Profile({
  handle,
  pubkey,
  profile,
  events,
  relays = [],
}) {
  const ndk = useNdk();
  const ndkEvents = useMemo(
    () => events.map((e) => new NDKEvent(ndk, e)),
    [events]
  );
  return (
    <>
      <Head>
        <title>{profile?.name || handle}</title>
        <meta name="og:title" content={profile?.name || handle} />
        <meta name="og:type" content="profile" />
        <meta name="og:description" content={profile?.about} />
        {profile?.picture && <meta name="og:image" content={profile.picture} />}
      </Head>
      <Layout>
        <Stack spacing="2">
          <Flex justifyContent="space-between">
            <User
              pubkey={pubkey}
              user={profile}
              size="xl"
              flexDirection="column"
            />
            <FollowButton pubkey={pubkey} />
          </Flex>
          {profile?.about && <Markdown content={profile?.about} />}
        </Stack>
        <UserContent events={ndkEvents} pubkey={pubkey} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale, params }) {
  const { handle } = params;
  const pubkey = getPubkey(handle);
  const events = await getEvents(pubkey);
  const profile = await getProfile(pubkey);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      handle,
      pubkey,
      events,
      profile,
    },
  };
}

export async function getStaticPaths() {
  const handles = getHandles();
  const paths = handles.map((handle) => {
    return {
      params: { handle },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
