const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

exports.handler = async function (event) {
  const payload = JSON.parse(event.body).payload;

  // Determine if this submission should go to Mailchimp
  const isSubscriber = payload.form_name === "subscriber";
  const isContactWithNewsletter =
    payload.form_name === "about-contact" && payload.data.newsletter === "yes";

  if (!isSubscriber && !isContactWithNewsletter) {
    return { statusCode: 200, body: "No Mailchimp action needed — skipping" };
  }

  const email = payload.data.email;
  if (!email) {
    return { statusCode: 400, body: "No email provided" };
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: "subscribed",
    });

    return { statusCode: 200, body: "Subscribed successfully" };
  } catch (err) {
    // If already subscribed, Mailchimp returns a 400 with "Member Exists"
    // Treat this as success — they're already on the list
    if (err.status === 400 && err.response && err.response.body) {
      const detail = err.response.body.detail || "";
      if (detail.includes("Member Exists")) {
        return { statusCode: 200, body: "Already subscribed" };
      }
    }

    console.error("Mailchimp error:", err.message || err);
    return { statusCode: 500, body: "Mailchimp subscription failed" };
  }
};
