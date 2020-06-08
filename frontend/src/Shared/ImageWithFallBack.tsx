import React, { useState, Fragment } from "react";
import { Image, ImageProps } from "rebass";

export const ImageWithFallBack: React.FunctionComponent<
  ImageProps & { children?: string }
> = (props) => {
  const [error, setError] = useState(false);
  if (error) {
    if (props.children != null) return <Fragment>{props.children}</Fragment>;
    return <Image {...props} src={""} />;
  }
  return <Image {...props} onError={() => setError(true)} />;
};

export const Avatar: React.FunctionComponent<
  ImageProps & { children?: string }
> = (props) => {
  return <ImageWithFallBack>{props.children}</ImageWithFallBack>;
};
