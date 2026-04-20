const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const brandHeader = `
  <div style="background:#0a0f0a;padding:32px 40px 20px;border-bottom:1px solid rgba(167,201,87,0.15)">
    <h1 style="font-family:'Arial Black',sans-serif;font-size:28px;letter-spacing:0.2em;
      color:#a7c957;margin:0;text-transform:uppercase">AMIANCE</h1>
    <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.28em;
      text-transform:uppercase;color:rgba(167,201,87,0.45);margin:4px 0 0">
      SS 2026 — Wear The Streets
    </p>
  </div>`;

const brandFooter = `
  <div style="background:#060b06;padding:24px 40px;border-top:1px solid rgba(167,201,87,0.08);
    text-align:center;margin-top:0">
    <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(242,232,207,0.25);
      letter-spacing:0.12em;margin:0">
      © 2026 AMIANCE. All rights reserved.<br>
      12 Fabric Lane, London W1 — hello@amiance.co
    </p>
  </div>`;

exports.sendVerificationEmail = async (user, token) => {
  const transporter = createTransporter();
  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"AMIANCE" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify your AMIANCE account — One step left",
    html: `
      <div style="background:#0a0f0a;font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
        ${brandHeader}
        <div style="padding:48px 40px">
          <p style="color:rgba(167,201,87,0.6);font-size:9px;letter-spacing:0.28em;
            text-transform:uppercase;margin:0 0 16px">Account Verification</p>
          <h2 style="font-family:'Arial Black',sans-serif;font-size:36px;color:#f2e8cf;
            margin:0 0 20px;line-height:1.1">Welcome to the movement, ${user.name.split(" ")[0]}.</h2>
          <p style="color:rgba(242,232,207,0.45);font-size:14px;line-height:1.9;margin:0 0 32px;font-weight:300">
            You're one step away from exclusive drops, limited pieces, and a wardrobe redefined.
            Verify your email to activate your account.
          </p>
          <a href="${verifyURL}" style="display:inline-block;background:#a7c957;color:#0a0f0a;
            padding:16px 40px;font-size:11px;font-weight:800;letter-spacing:0.18em;
            text-transform:uppercase;text-decoration:none;margin-bottom:24px">
            Verify My Account →
          </a>
          <p style="color:rgba(242,232,207,0.2);font-size:11px;margin:24px 0 0;line-height:1.7">
            This link expires in <strong style="color:rgba(242,232,207,0.4)">24 hours</strong>.
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
        ${brandFooter}
      </div>`,
  });
};

exports.sendPasswordResetEmail = async (user, token) => {
  const transporter = createTransporter();
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"AMIANCE" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Reset your AMIANCE password",
    html: `
      <div style="background:#0a0f0a;font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
        ${brandHeader}
        <div style="padding:48px 40px">
          <p style="color:rgba(167,201,87,0.6);font-size:9px;letter-spacing:0.28em;
            text-transform:uppercase;margin:0 0 16px">Password Reset</p>
          <h2 style="font-family:'Arial Black',sans-serif;font-size:36px;color:#f2e8cf;
            margin:0 0 20px;line-height:1.1">Reset your password.</h2>
          <p style="color:rgba(242,232,207,0.45);font-size:14px;line-height:1.9;margin:0 0 32px;font-weight:300">
            You requested a password reset. Click below to set a new password.
            This link is valid for 15 minutes only.
          </p>
          <a href="${resetURL}" style="display:inline-block;background:#a7c957;color:#0a0f0a;
            padding:16px 40px;font-size:11px;font-weight:800;letter-spacing:0.18em;
            text-transform:uppercase;text-decoration:none">
            Reset Password →
          </a>
          <p style="color:rgba(242,232,207,0.2);font-size:11px;margin:24px 0 0;line-height:1.7">
            If you didn't request this, ignore this email — your password won't change.
          </p>
        </div>
        ${brandFooter}
      </div>`,
  });
};

exports.sendOrderConfirmationEmail = async (user, order) => {
  const transporter = createTransporter();
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid rgba(167,201,87,0.06)">
          <p style="color:#f2e8cf;font-size:13px;font-weight:600;margin:0 0 3px">${item.name}</p>
          <p style="color:rgba(242,232,207,0.35);font-size:11px;margin:0">
            Size: ${item.size || "M"} · Qty: ${item.qty}
          </p>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid rgba(167,201,87,0.06);
          text-align:right;font-size:16px;font-weight:700;color:#a7c957;
          font-family:'Arial Black',sans-serif">
          ₹${(item.price * item.qty).toLocaleString("en-IN")}
        </td>
      </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `"AMIANCE" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Order Confirmed — #AMI-${order._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="background:#0a0f0a;font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
        ${brandHeader}
        <div style="padding:48px 40px">
          <p style="color:rgba(167,201,87,0.6);font-size:9px;letter-spacing:0.28em;
            text-transform:uppercase;margin:0 0 16px">Order Confirmed</p>
          <h2 style="font-family:'Arial Black',sans-serif;font-size:36px;color:#f2e8cf;
            margin:0 0 8px;line-height:1.1">It's on its way.</h2>
          <p style="color:rgba(167,201,87,0.5);font-size:11px;letter-spacing:0.14em;margin:0 0 32px">
            Order #AMI-${order._id.toString().slice(-6).toUpperCase()}
          </p>
          <table style="width:100%;border-collapse:collapse">${itemsHTML}</table>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(167,201,87,0.12)">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:rgba(242,232,207,0.4);font-size:13px">Shipping</span>
              <span style="color:rgba(242,232,207,0.4);font-size:13px">
                ${order.shippingPrice === 0 ? "Free" : "₹" + order.shippingPrice}
              </span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:#f2e8cf;font-size:15px;font-weight:700">Total</span>
              <span style="color:#a7c957;font-size:20px;font-weight:800;
                font-family:'Arial Black',sans-serif">
                ₹${order.totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <p style="margin:16px 0 0;color:rgba(242,232,207,0.3);font-size:11px">
              Payment: ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment"}
            </p>
          </div>
          <div style="margin-top:32px;padding:20px 24px;
            background:rgba(167,201,87,0.05);border:1px solid rgba(167,201,87,0.1)">
            <p style="color:rgba(167,201,87,0.7);font-size:9px;letter-spacing:0.2em;
              text-transform:uppercase;margin:0 0 8px">Shipping To</p>
            <p style="color:rgba(242,232,207,0.5);font-size:13px;line-height:1.7;margin:0">
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postcode}
            </p>
          </div>
        </div>
        ${brandFooter}
      </div>`,
  });
};

exports.sendWelcomeEmail = async (user) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"AMIANCE" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Welcome to AMIANCE — Your account is verified",
    html: `
      <div style="background:#0a0f0a;font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
        ${brandHeader}
        <div style="padding:48px 40px;text-align:center">
          <p style="font-size:48px;margin:0 0 20px">✦</p>
          <h2 style="font-family:'Arial Black',sans-serif;font-size:40px;color:#f2e8cf;
            margin:0 0 20px;line-height:1.1">You're in.</h2>
          <p style="color:rgba(242,232,207,0.45);font-size:14px;line-height:1.9;
            margin:0 0 32px;font-weight:300;max-width:400px;margin:0 auto 32px">
            Welcome to the movement, ${user.name.split(" ")[0]}. Your account is now verified.
            Explore the latest SS26 drop before it's gone.
          </p>
          <a href="${process.env.CLIENT_URL}/shop" style="display:inline-block;
            background:#a7c957;color:#0a0f0a;padding:16px 40px;font-size:11px;
            font-weight:800;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none">
            Shop The Collection →
          </a>
        </div>
        ${brandFooter}
      </div>`,
  });
};