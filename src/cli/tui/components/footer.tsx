import { Box, Text } from "ink";

import { useAgentLoop } from "../hooks/use-agent-loop";

export function Footer() {
  const { agent } = useAgentLoop();
  return (
    <Box paddingLeft={2}>
      <Text dimColor>{agent.model.name}</Text>
    </Box>
  );
}
