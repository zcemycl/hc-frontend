"use client";

import { check_neo4j_health, check_pg_health } from "@/http/internal";
import { useEffect, useState } from "react";

interface IMsg {
  data?: string;
}

const useDbsHealth = () => {
  const [isPGHealthy, setIsPGHealthy] = useState(false);
  const [isNeo4JHealthy, setIsNeo4JHealthy] = useState(false);
  const [pgHealthMsg, setPgHealthMsg] = useState<IMsg>({});
  const [neo4jHealthMsg, setNeo4jHealthMsg] = useState<IMsg>({});

  useEffect(() => {
    let isMounted = true;

    const fetchPgHealth = async () => {
      try {
        const resp = await check_pg_health();
        if (isMounted) setPgHealthMsg({ data: resp.message });
      } catch (error) {
        if (isMounted) setPgHealthMsg({ data: "False" });
      }
    };

    const interval = setInterval(fetchPgHealth, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let isMounted = true; // Prevents state update after unmount

    const fetchNeo4jHealth = async () => {
      try {
        const resp = await check_neo4j_health();
        if (isMounted) setNeo4jHealthMsg({ data: resp.message });
      } catch (error) {
        if (isMounted) setNeo4jHealthMsg({ data: "False" });
      }
    };

    // Fetch every 5 seconds using setInterval
    const interval = setInterval(fetchNeo4jHealth, 5000);

    // Cleanup function to stop interval when component unmounts
    return () => {
      isMounted = false; // Prevent state update on unmounted component
      clearInterval(interval);
    };
  }, []);

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
