import React from "react";
import YouTube from "react-youtube";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
function getYoutubeVideoId(url: string) {
  try {
    return new URL(url).searchParams.get("v");
  }
  catch {
    return;
  }
}
export function YouTubeView(props: {
  url: string;
  play: BehaviorSubject<boolean>;
}) {
  const id = getYoutubeVideoId(props.url);
  if (!id)
    return null;
  const opts = {
    height: "390",
    width: "100%",
  };
  return (<YouTube onPlay={() => {
    props.play.next(true);
  }} onReady={(e) => {
    props.play.pipe(filter((c) => !c)).subscribe(() => {
      e.target.pauseVideo();
    });
  }} videoId={id} opts={opts}></YouTube>);
}
