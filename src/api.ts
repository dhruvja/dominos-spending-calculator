export const makeApiCalls = async (cookies: chrome.cookies.Cookie[]) => {
  try {
    const cookieMap: { [name: string]: string } = {};
    cookies.forEach((cookie) => {
      cookieMap[cookie.name] = cookie.value;
    });

    let userInfo = JSON.parse(decodeURIComponent(cookieMap.userInfo));
    console.log(userInfo.headers.credentials.accessKeyId);
    console.log(cookieMap.userId);
    let userId = cookieMap.userId;
    const myHeaders = new Headers();
    myHeaders.append("authtoken", userInfo.headers.credentials.accessKeyId);
    myHeaders.append("userid", userId);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    let total = 0;
    let number = 0;
    let quantity = 0;
    while(1) {
        const response = await fetchWrrapper(
            `https://api.dominos.co.in/order-service/ve1/orders?size=50&number=${number}`,
            requestOptions
          );
          const data = JSON.parse(response);
          
          quantity += data.orders.length;
          data.orders.forEach((rows: { netPrice: number }) => {
            total += rows.netPrice;
          });
          if ("link" in data) {
            number++;
          }
          else {
            break;
          }
    }
   
    return {total, quantity};
  } catch (e) {
    console.log(e);
    throw new Error("Error while making api calls to zomato");
  }
};

const fetchWrrapper = async (url: string, options: RequestInit) => {
  return fetch(url, options)
    .then((response) => {
      return response.text();
    })
    .catch((_) => {
      return "";
    });
};
