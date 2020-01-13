
@deep: ~'>>>';
  #login{
    width: 100%;
    height: 100%;
    min-height: 618px;
    // height: 100vh;
    background-image: url("../assets/img/loginHand.png"), url("../assets/img/loginBackNew.png");
    background-size: 646px 546px, 100% 100%;
    background-repeat: no-repeat, no-repeat;
    background-position: bottom left, 0 0;
    &>p{
      position: absolute;
      top: 8vh;
      left: 92px;
      font-size: 32px;font-size: 2rem;
      color: #fff;
    }
  }
  .l-box{
    position: relative;
    top: 15vh;
    left: 61.8%;
    width: 30%;
    min-width: 350px;
    height: 70%;
    max-height: 450px;
    border: 1px solid #eee;
    border-radius: 10px;
    text-align: center;
    background: #fff;
    box-shadow: 0 10px 10px rgba(0,0,0,0.3);
    form{
      width: 80%;
      min-width: 280px;
      margin: 0 auto;
      >div {
        width: 100%;
      }
      #cbrcIcon1 {
        margin: 0 auto;
        width: 280px;
      }
      .congressIcon {
        margin: 65px 0 20px;
        padding: 0px 6px 0px 0px;
        float: left;
      }
      .cbrc{
        margin: 68px 0 20px;
        float: left;
      }
      .cbrc2{
        margin: 0 0 42px 0;
      }
      @{deep} .el-form-item{
        margin-bottom: 0;
        .inUsernm {
          width: 100%;height:100%;display: inline-block;background-image: url("../../static/images/icon_user.png");background-size: 100% 100%;
        }
        .inPwd {
          width: 100%;height:100%;display: inline-block;background-image: url("../../static/images/icon_lock.png");background-size: 100% 100%;
        }
        .el-form-item__content{
          line-height: 34px;
          // 输入框
          .el-input--small{
            height: 34px;
            line-height: 34px;
            border-radius: 4px;
            &:first-child{
              margin-bottom: 26px;
            }
            .el-input__inner{
              height: 34px;
              line-height: 34px;
              padding-left: 42px;
              // placeholder样式
              &::-webkit-input-placeholder{
                color:#999;
                letter-spacing: 2px;
                font-weight: bold;
              }
              &::-moz-placeholder{   /* Mozilla Firefox 19+ */
                color:#999;
                letter-spacing: 2px;
                font-weight: bold;
              }
              &:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                color:#999;
                letter-spacing: 2px;
                font-weight: bold;
              }
              &:-ms-input-placeholder{  /* Internet Explorer 10-11 */
                color:#999;
                letter-spacing: 2px;
                font-weight: bold;
              }
            }
            // icon
            .el-input__prefix{
              left: 0;
              width: 34px;
              // background: #0B98FF;
              color: #fff;
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
              .el-input__icon{
                font-weight: bold;
                font-size: 18px;font-size: 1.125rem;
              }
            }
          }
          // 登录按钮
          .el-button{
            width: 100%;
            font-size: 16px;font-size: 1rem;
            background: #0B98FF;
            margin-top: 20px;
          }
        }
      }
      &>p{
        text-align: left;
        margin: 16px 0;
      }
    }
  }