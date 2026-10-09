"use client";

import {catchError, type ErrorInfo} from "next/error";

function ErrorFallback(props: {title: string}, {error, retry}: ErrorInfo) {
  const {message} = error as Error;
  return (
    <div>
      <p className="text-red-500 text-sm">{props.title}</p>
      <p className="text-red-500 text-xs">{message}</p>
      {/* <button className="text-red-500 text-sm" onClick={() => retry()}>Try again</button> */}
    </div>
  );
}

export default catchError(ErrorFallback);
