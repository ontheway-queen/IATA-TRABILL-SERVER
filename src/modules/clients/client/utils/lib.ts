class ClientLib {
  public static parseMobileData(mobile: { mobile: string; number: string }[]) {
    const mobileInfo: string[] = [];

    if (mobile) {
      for (let i = 0; i < mobile.length; i++) {
        const element = mobile[i];

        const toPush: string = element.number;

        mobileInfo.push(toPush);
      }
    }

    return mobileInfo;
  }
}

export default ClientLib;
