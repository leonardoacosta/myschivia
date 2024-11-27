import { useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useSignIn, useSignOut, useUser } from "~/utils/auth";

function PostCard(props: { e: any; onDelete: () => void }) {
  console.log(props.e);
  return (
    <View className="flex flex-row rounded-lg bg-muted p-4">
      <View className="flex-grow">
        <Link
          asChild
          href={{
            pathname: "/post/[id]",
            params: { id: props.e.id },
          }}
        >
          <Pressable className="">
            <Text className="text-xl font-semibold text-primary">
              {props.e.name}
            </Text>
            <Text className="mt-2 text-foreground">{props.e.location}</Text>

            <Text className="mt-2 text-foreground">
              {props.e.description}
              {JSON.stringify(props.e)}
            </Text>

            <Text className="mt-2 text-foreground">
              {props.e.mature && "Mature Audiences"}
            </Text>
            <Text className="mt-2 text-foreground">{format(props.e.startDate)}</Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={props.onDelete}>
        <Text className="font-bold uppercase text-primary">Delete</Text>
      </Pressable>
    </View>
  );
}

// function CreatePost() {
//   const utils = api.useUtils();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const { mutate, error } = api.post.create.useMutation({
//     async onSuccess() {
//       setTitle("");
//       setContent("");
//       await utils.post.all.invalidate();
//     },
//   });

//   return (
//     <View className="mt-4 flex gap-2">
//       <TextInput
//         className="items-center rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground"
//         value={title}
//         onChangeText={setTitle}
//         placeholder="Title"
//       />
//       {error?.data?.zodError?.fieldErrors.title && (
//         <Text className="mb-2 text-destructive">
//           {error.data.zodError.fieldErrors.title}
//         </Text>
//       )}
//       <TextInput
//         className="items-center rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground"
//         value={content}
//         onChangeText={setContent}
//         placeholder="Content"
//       />
//       {error?.data?.zodError?.fieldErrors.content && (
//         <Text className="mb-2 text-destructive">
//           {error.data.zodError.fieldErrors.content}
//         </Text>
//       )}
//       <Pressable
//         className="flex items-center rounded bg-primary p-2"
//         onPress={() => {
//           mutate({
//             title,
//             content,
//           });
//         }}
//       >
//         <Text className="text-foreground">Create</Text>
//       </Pressable>
//       {error?.data?.code === "UNAUTHORIZED" && (
//         <Text className="mt-2 text-destructive">
//           You need to be logged in to create a post
//         </Text>
//       )}
//     </View>
//   );
// }

function MobileAuth() {
  const user = useUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return (
    <>
      <Text className="pb-2 text-center text-xl font-semibold text-white">
        {user?.name ?? "Not logged in"}
      </Text>
      <Button
        onPress={() => (user ? signOut() : signIn())}
        title={user ? "Sign Out" : "Sign In With Discord"}
        color={"#5B65E9"}
      />
    </>
  );
}

export default function Index() {
  const utils = api.useUtils();

  const postQuery = api.event.all.useQuery({
    type: null,
    campId: null,
    mature: null,
    day: null,
  });

  // const deletePostMutation = api.post.delete.useMutation({
  //   onSettled: () => utils.post.all.invalidate(),
  // });

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Tribal <Text className="text-primary">Cities</Text>
        </Text>

        <MobileAuth />

        <View className="py-2">
          <Text className="font-semibold italic text-primary">
            Press on a post
          </Text>
        </View>

        <FlashList
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(d) =>
            (d.item.at(1) as any).map((e: any) => (
              <PostCard
                e={e}
                // onDelete={() => deletePostMutation.mutate(p.item.id)}
              />
            ))
          }
        />

        {/* <CreatePost /> */}
      </View>
    </SafeAreaView>
  );
}
