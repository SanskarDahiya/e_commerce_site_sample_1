import { GetServerSidePropsResult } from "next";

function MyComponent() {
  return null;
}

export default MyComponent;

export function getServerSideProps(): GetServerSidePropsResult<any> {
  return {
    redirect: {
      permanent: true,
      destination: "/",
    },
  };
}
