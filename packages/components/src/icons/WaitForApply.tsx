import * as React from "react";

export interface WaitForApplyProps {
  height?: string;
  width?: string;
}

export const WaitForApply: React.SFC<WaitForApplyProps> = props => {
  return (
    <svg width={props.width || "54"} height={props.height || "54"} xmlns="http://www.w3.org/2000/svg">
      <circle id="a" fill="#90e8d3" cx="27" cy="27" r="27" />
      <g fill="none" fillRule="evenodd">
        <path
          d="m22.0188072 35.5783153h-2.7243229v-3.6842105c0-.4440359-.3660757-.8044128-.8171334-.8044128s-.8171334.3603769-.8171334.8044128v4.4886233c0 .4440359.3660757.8044128.8171334.8044128h3.5414563c.4510577 0 .8171335-.3603769.8171335-.8044128 0-.4440358-.3656672-.8044128-.8171335-.8044128zm18.7752752-18.3273385-6.2919275-6.9802919c-.1552554-.1721443-.3775157-.2706849-.6112159-.2706849h-17.2349785c-.4510577 0-.8171335.3603769-.8171335.8044128v17.4633992c-3.3960066 1.1853022-5.838827 4.3707768-5.838827 8.1153183 0 4.7512641 3.9263262 8.6168697 8.7531334 8.6168697 2.8566986 0 5.3902208-1.360262 6.9889424-3.4509308h14.4407908c.4510576 0 .8171334-.3603769.8171334-.8044128v-22.9599517c0-.1970812-.073542-.3869226-.2059176-.5337279zm-6.1007183-4.3442312 3.7122372 4.1181912h-3.7122372zm-15.9406392 30.4840266c-3.9251005 0-7.1188666-3.1436451-7.1188666-7.0080441s3.1933575-7.0080441 7.1188666-7.0080441c3.925509 0 7.1188665 3.1440473 7.1188665 7.0080441s-3.1933575 7.0080441-7.1188665 7.0080441zm20.6130082-3.4509308h-12.6496343c.5025371-1.0859572.7901681-2.2877499.7901681-3.5571133 0-.22604-.0171598-.4476557-.0343196-.6692714h7.6205865c.4510576 0 .8171334-.3603769.8171334-.8044128s-.3660758-.8044128-.8171334-.8044128h-7.9069918c-.336659-1.2062169-.9270379-2.3090669-1.7204745-3.2429901h9.6270577c.4510577 0 .8171334-.3603769.8171334-.8044128 0-.4440358-.3660757-.8044128-.8171334-.8044128h-11.4304712c-1.4009753-.937543-3.0903986-1.486957-4.9089291-1.486957-.4355321 0-.8608501.0418295-1.2800396.1029649v-16.2603999h15.5860033v6.2209262c0 .4440358.3660758.8044128.8171335.8044128h5.4895024v21.306079zm-18.4365733-14.7340266c0 .4440358.3660758.8044127.8171334.8044127h13.3462406c.4510576 0 .8171334-.3603769.8171334-.8044127 0-.4440359-.3660758-.8044128-.8171334-.8044128h-13.3462406c-.4514662 0-.8171334.3599747-.8171334.8044128zm0-5c0 .4440358.2194549.8044127.4898547.8044127h8.0007976c.2703998 0 .4898547-.3603769.4898547-.8044127 0-.4440359-.2194549-.8044128-.4898547-.8044128h-8.0007976c-.2706447 0-.4898547.3599747-.4898547.8044128z"
          fill="#000"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};
