import { Poppins } from "next/font/google";

const poppins = Poppins({
    weight: ["400", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
    display: "swap",
});

export { poppins };