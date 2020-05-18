import { withFork } from "effector-next";
import Document from "next/document";

const enhance = withFork({ debug: false });

export default enhance(Document);
