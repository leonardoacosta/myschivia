import { ChannelBox } from "planby";

import { Avatar, AvatarFallback, AvatarImage } from "@tribal-cities/ui/avatar";

export const ChannelItem = ({ channel }: any) => {
  const { position, logo, title } = channel;

  const acronym = title
    .split(" ")
    .reduce((acc: string, word: string, index: number) => {
      if (index > 1) return acc;
      return acc + word[0];
    }, "");

  return (
    <ChannelBox {...position}>
      {/* Overwrite styles by add eg. style={{ maxHeight: 52, maxWidth: 52,... }} */}
      {/* Or stay with default styles */}
      {/* <ChannelLogo
        src={logo}
        alt="Logo"
        style={{ maxHeight: 52, maxWidth: 52 }}
      /> */}
      <div className="mb-4 max-w-full flex-row items-center justify-center overflow-hidden whitespace-nowrap text-center align-middle">
        <Avatar className="mx-auto">
          <AvatarImage src={logo} width={52} height={52} />
          <AvatarFallback>{acronym}</AvatarFallback>
        </Avatar>
        <p className="max-w-full text-ellipsis whitespace-nowrap text-xs">
          {title}
        </p>
      </div>
    </ChannelBox>
  );
};
