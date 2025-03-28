"use client";

import { FASTAPI_URI } from "@/http/backend/constants";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const useDbsHealth = () => {
  const [isPGHealthy, setIsPGHealthy] = useState(false);
  const [isNeo4JHealthy, setIsNeo4JHealthy] = useState(false);
  const WS_URI =
    process.env.NEXT_PUBLIC_ENV_NAME === "dev"
      ? FASTAPI_URI!.replace("http", "ws")
      : "ws://localhost:4001";

  const { lastMessage: pgHealthMsg } = useWebSocket(
    `${WS_URI}/postgres-status`,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );
  const { lastMessage: neo4jHealthMsg } = useWebSocket(
    `${WS_URI}/neo4j-status`,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

  useEffect(() => {
    if (pgHealthMsg !== null) {
      setIsPGHealthy(pgHealthMsg.data === "True");
    }
  }, [pgHealthMsg]);

  useEffect(() => {
    if (neo4jHealthMsg !== null) {
      setIsNeo4JHealthy(neo4jHealthMsg.data === "True");
    }
  }, [neo4jHealthMsg]);

  return { isPGHealthy, isNeo4JHealthy, pgHealthMsg, neo4jHealthMsg };
};

export { useDbsHealth };
