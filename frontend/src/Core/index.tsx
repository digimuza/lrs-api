import { Observable, from, NEVER } from "rxjs";
import { catchError } from "rxjs/operators";
import React, { useState, useLayoutEffect, Fragment } from "react";

export function useObservable<T>(data: Observable<T>): T | null {
  const [value, setValue] = useState<T | null>(null);
  useLayoutEffect(() => {
    const subscription = data.subscribe((v) => {
      setValue(v);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return value;
}

export function Watch<T>(props: {
  data: Observable<T> | Promise<T>;
  children: (data: T) => any;
  fallback?: JSX.Element | null;
  forceLoading?: boolean
  error?: (props: { error: Error }) => JSX.Element | null;
}) {
  const [error, setError] = useState<Error | null>(null);
  const value = useObservable(
    from(props.data).pipe(
      catchError((err) => {
        setError(err);
        return NEVER;
      })
    )
  );
  if (error)
    return props.error ? props.error({ error }) : <div>Got error!!!</div>;
  if (props.forceLoading) return props.fallback || null
  if (value == null) return props.fallback || null;
  return <Fragment>{props.children(value)}</Fragment>;
}
