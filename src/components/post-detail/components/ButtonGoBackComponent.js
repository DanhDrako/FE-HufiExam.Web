import { LeftCircleTwoTone } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";

function ButtonGoBack(props) {
  const goRef = React.useRef(null);

  let history = useHistory();

  function handleClick() {
    history.goBack();
  }

  const executeScroll = () => goRef.current.scrollIntoView()

  React.useEffect(() => {
    executeScroll();
  });

  return (
    <div className=''>
      <Button ref={goRef} icon={<LeftCircleTwoTone />} type='primary' ghost onClick={handleClick}>
        Quay về trang trước đó
      </Button>
    </div>
  );
}

export default ButtonGoBack;