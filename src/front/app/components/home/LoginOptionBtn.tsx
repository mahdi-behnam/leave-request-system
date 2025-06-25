import Button, { type ButtonProps } from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const LoginOptionBtn: React.FC<LoginOptionBtnProps> = ({
  color,
  title,
  href,
  img,
}) => {
  return (
    <Button
      color={color}
      variant="contained"
      href={href}
      sx={{
        boxShadow: 20,
        p: 3,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img src={img.src} alt={img.alt} width={100} height={100} />
      <Typography mt={2} fontWeight={500}>
        {title}
      </Typography>
    </Button>
  );
};

export interface LoginOptionBtnProps {
  color: ButtonProps["color"];
  title: string;
  href: string;
  img: {
    src: string;
    alt: string;
  };
}

export default LoginOptionBtn;
