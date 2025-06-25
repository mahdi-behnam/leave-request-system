import type { Route } from "./+types/home";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoginOptionBtn, {
  type LoginOptionBtnProps,
} from "~/components/home/LoginOptionBtn";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome - Leave Request Portal" },
    {
      name: "description",
      content:
        "This portal is dedicated to leave requests management by supervisors and employees can also use it to request a leave.",
    },
  ];
}

export default function Home() {
  return (
    <Stack
      className="home-container"
      boxShadow={20}
      borderRadius={7}
      padding={8}
    >
      <Typography component="h5" variant="h5" fontWeight={500}>
        Welcome to Leave Request Portal!
      </Typography>
      <Typography variant="body1" mt={1}>
        Please choose one of the options below to login.
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2} mt={5}>
        {loginOptions.map((o, idx) => (
          <LoginOptionBtn key={idx} {...o} />
        ))}
      </Stack>
    </Stack>
  );
}

const loginOptions: LoginOptionBtnProps[] = [
  {
    color: "warning",
    title: "Admin",
    href: "/admin",
    img: {
      src: "admin-thumbnail.png",
      alt: "Login as Admin",
    },
  },
  {
    color: "secondary",
    title: "Supervisor",
    href: "/login?role=supervisor",
    img: {
      src: "supervisor-thumbnail.png",
      alt: "Login as Supervisor",
    },
  },
  {
    color: "primary",
    title: "Employee",
    href: "/login?role=employee",
    img: {
      src: "employee-thumbnail.png",
      alt: "Login as Employee",
    },
  },
];
