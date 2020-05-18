import { withHydrate } from "effector-next";
import App from "next/app";

const enhance = withHydrate();

export default enhance(App);
