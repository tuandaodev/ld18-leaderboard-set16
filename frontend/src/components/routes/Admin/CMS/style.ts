import styled from 'styled-components';

export const HomeWrapper = styled.div`
  height: -webkit-fill-available;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 1.5rem;

  .ant-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: max-content;
    .ant-card-body {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 1.5rem;
    }
  }

  .ant-card-body {
    overflow: hidden;

    @media (min-width: 830px) {
      // width: 40rem;
    }
    @media (min-width: 1000px) {
      padding-left: 10%;
      padding-right: 10%;
    }

    @media (min-width: 1366px) {
      padding-left: 10%;
      padding-right: 10%;
    }
    @media (min-width: 1800px) {
      padding-left: 20%;
      padding-right: 20%;
    }

    #weekViewControl,
    bookingControl {
      max-width: 100%;
    }
    .ant-row {
      width: 100%;
    }
  }
  .richTextWrapper {
    display: flex;
    justify-content: end;
    align-content: center;
    position: relative;

    .ant-btn {
      border-radius: 0px 8px 8px 0px;
      height: 20rem !important;

      height: 30rem !important;
      @media (min-width: 830px) {
        height: 20rem !important;
      }
    }

    .quill {
      overflow: hidden !important;
      height: 30rem;
      @media (min-width: 830px) {
        height: 20rem;
      }

      overflow: scroll;
      border: 1px solid #ccc;
      box-sizing: border-box;
      border-radius: 8px 0px 0px 8px;
      width: 100%;

      // @media (min-width: 830px) {
      //   width: 40rem;
      // }
      // @media (min-width: 1000px) {
      //   width: 40rem;
      // }

      // @media (min-width: 1366px) {
      //   width: 50rem;
      // }

      .ql-toolbar {
        max-width: 100%;
        position: sticky;
        top: 0;
        z-index: 20;
        background-color: rgb(255 255 255);
        border-width: 0px !important;
        border-bottom-width: 1px !important;
        // border-radius: 8px 8px 0px 0px;
      }

      .ql-container {
        max-width: 100%;
        z-index: 10;
        border-width: 0px !important;
        border-radius: 0px 0px 8px 8px;
      }
    }
  }

  #weekViewControl,
  #bookingControl {
    width: 100%;
  }
  .ant-btn-compact-last-item {
    height: -webkit-fill-available;
    height: 100%;
  }

  .ant-input {
    border-radius: 8px 0px 0px 8px;
  }

  .ant-col-8 {
    text-align: start;
  }

  .ant-form-item-no-colon {
    width: max-content;
  }
  .ant-form-item-label {
    max-width: 100%;
  }

  .ant-form-item-control-input-content {
    display: flex;
    justify-content: end;
  }

  @media (min-width: 830px) {
    .ant-form {
      min-width: 500px;
    }
  }

  @media (min-width: 1023px) {
    .ant-form {
      min-width: 500px;
    }
  }
  @media (min-width: 1250px) {
    .ant-form {
      min-width: 700px;
    }
  }

  @media (max-width: 1194px) {
    .ant-row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
