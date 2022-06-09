const PageLayout = (props) => {
  const { children, title } = props;

  return (
    <>
      <h1>{title}</h1>
      <hr />
      {children}
    </>
  );
};

export default PageLayout;
