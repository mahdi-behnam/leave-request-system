import type { ReactNode } from "react";
import Container from "@mui/material/Container";
import { Outlet } from "react-router";

interface Props {
  children: ReactNode | ReactNode[];
}

const RootLayout: React.FC<Props> = () => {
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Outlet />
    </Container>
  );
};

export default RootLayout;
