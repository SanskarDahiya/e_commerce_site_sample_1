function Error({ statusCode }) {
  return (
    <div className="w-full h-full flex justify-center align-middle py-10">
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
      <br />
      Currently the page is not available.
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
