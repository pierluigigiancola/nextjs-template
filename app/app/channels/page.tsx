import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { Client } from "twitter-api-sdk";
import XButton from "./XButton";

export default async function ChannelsPage() {
  const postHello = async () => {
    "use server";

    const session = await auth();

    const bearer = await db.query.accounts.findFirst({
      columns: {
        access_token: true,
      },
      where: (fields, operators) =>
        // @ts-ignore
        operators.eq(fields.userId, session?.user?.id),
    });
    // @ts-ignore
    const client = new Client(bearer?.access_token);
    try {
      const me = await client.tweets.createTweet({
        text: "Hello, world!",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <XButton action={postHello} />
      <Button>LinkedIn</Button>
    </div>
  );
}
