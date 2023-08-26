import { TI_API_INSTANCE, TI_API_KEY } from "@env";

export const registerUser = async (
  email: string,
  firstName: string,
  lastName: string
) => {
  try {
    const response = await fetch(TI_API_INSTANCE + "/incoming/v2/users", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + TI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        externalCustomerId: email,
        sendInvite: true,
      }),
    });

    const responseData = await response.json();

    if (responseData.errors && responseData.errors.length > 0) {
      throw new Error(responseData.errors[0].message);
    } else {
      return responseData;
    }
  } catch (error) {
    throw error;
  }
};
