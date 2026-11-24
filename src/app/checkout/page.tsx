
"use client";

import { useEffect, useState } from "react";
import {
  getCountryCallingCode,
  isValidPhoneNumber,
  type CountryCode,
} from "libphonenumber-js";
const countryCodes = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
DE DJ DK DM DO DZ EC EE EG EH ER ES ET
FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
HK HM HN HR HT HU
ID IE IL IM IN IO IQ IR IS IT JE JM JO JP
KE KG KH KI KM KN KP KR KW KY KZ
LA LB LC LI LK LR LS LT LU LV LY
MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
NA NC NE NF NG NI NL NO NP NR NU NZ
OM
PA PE PF PG PH PK PL PM PN PR PS PT PW PY
QA
RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
UA UG UM US UY UZ
VA VC VE VG VI VN VU
WF WS YE YT ZA ZM ZW
`.trim().split(/\s+/);

const countryNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

const countryOptions = countryCodes
  .map((code) => {
    let callingCode = "";

    try {
      callingCode = `+${getCountryCallingCode(code as CountryCode)}`;
    } catch {
      callingCode = "";
    }

    return {
      code,
      callingCode,
      name: countryNames.of(code) || code,
      flag: String.fromCodePoint(
        ...[...code].map((letter) => letter.charCodeAt(0) + 127397)
      ),
    };
  })
  .filter((item) => item.callingCode !== "")
  .sort((a, b) => a.name.localeCompare(b.name));

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [phone, setPhone] = useState("+251 ");
  const [country, setCountry] = useState("Ethiopia");
  const [countrySearch, setCountrySearch] = useState("");
const [showCountryList, setShowCountryList] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [warningKey, setWarningKey] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
const [orderReference, setOrderReference] = useState("");
const [edition, setEdition] = useState("");
const [format, setFormat] = useState("");
const [quantity, setQuantity] = useState(1);
const [resellerStatus, setResellerStatus] = useState({
  checked: false,
  approved: false,
  commissionRate: 0,
});


const [checkingReseller, setCheckingReseller] = useState(false);

async function checkReseller(emailToCheck: string = email) {
  const cleanEmail = emailToCheck.trim().toLowerCase();

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    setResellerStatus({
      checked: false,
      approved: false,
      commissionRate: 0,
    });
    return;
  }

  setCheckingReseller(true);

  try {
    const response = await fetch(
      `/api/reseller/check?email=${encodeURIComponent(cleanEmail)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not check reseller status.");
    }

    setResellerStatus({
      checked: true,
      approved: data.approved,
      commissionRate: data.commissionRate,
    });
  } catch (error) {
    console.error("Reseller check error:", error);

    setResellerStatus({
      checked: false,
      approved: false,
      commissionRate: 0,
    });
  } finally {
    setCheckingReseller(false);
  }
}

const unitPrice = 1000;
const totalPrice = unitPrice * quantity;

const resellerCommission = resellerStatus.approved
  ? Number(
      ((totalPrice * resellerStatus.commissionRate) / 100).toFixed(2)
    )
  : 0;

const ownerAmount = totalPrice - resellerCommission;

const [price, setPrice] = useState("");
const [deliveryAddress, setDeliveryAddress] = useState("");
const [deliveryCity, setDeliveryCity] = useState("");
useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  setEdition(params.get("edition") || "");
  setFormat(params.get("format") || "");
  setPrice(params.get("price") || "");
}, []);

async function handleConfirmOrder() {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: name,
        email,
        phone,
        country,
        edition,
        format,
        quantity,
        paymentMethod,
        deliveryAddress,
        deliveryCity,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Could not save your order.");
      setWarningKey((previous) => previous + 1);
      return;
    }

    setOrderReference(result.orderReference);
    setOrderConfirmed(true);
    setShowConfirmation(false);
    setError("");
  } catch {
    setError("Connection problem. Please try again.");
    setWarningKey((previous) => previous + 1);
  }
}

function handleContinue() {
   if (
   !Number.isSafeInteger(quantity) ||
   quantity < 1
 ) {
   setError("Please enter a valid quantity.");
   setWarningKey((previous) => previous + 1);
   return;
 }
  if (!name.trim() || !email.trim() || !phone.trim() || !country.trim()) {
    setError("Please fill in all your details.");
    setWarningKey((previous) => previous + 1);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address.");
    setWarningKey((previous) => previous + 1);
    return;
  }
  if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
  setError("Email addresses do not match.");
  setWarningKey((previous) => previous + 1);
  return;
}
if (!isValidPhoneNumber(phone, countryOptions.find(
  (item) => item.name === country
)?.code as CountryCode)) {
  setPhoneError("Please enter a valid phone number.");
  setError("Please correct your phone number.");
  setWarningKey((previous) => previous + 1);
  return;
}

setPhoneError("");
  if (!edition || !format || !price) {
    setError("Please select a book and format first.");
    setWarningKey((previous) => previous + 1);
    return;
  }
  if (
  format === "Printed Book" &&
  (!deliveryAddress.trim() || !deliveryCity.trim())
) {
  setError("Please enter your delivery address and city.");
  setWarningKey((previous) => previous + 1);
  return;
}
if (!paymentMethod) {
  setError("Please choose a payment method.");
  setWarningKey((previous) => previous + 1);
  return;
}
  setError("");
setShowConfirmation(true);
}
  return (
    <main className="min-h-screen bg-[#090806] px-6 py-16 text-[#f2dfbd]">
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-xs tracking-[0.4em] text-[#d9ad5c]">
          OUR LAUGHTER IS ONE
        </p>

        <h1 className="mt-6 text-center font-[var(--font-cormorant)] text-5xl">
          Checkout
        </h1>

        <p className="mt-4 text-center text-sm text-[#bfb19d]">
          Complete your details to continue your order.
        </p>
<div className="mt-10 rounded-xl border border-[#bd9145]/50 bg-[#17130e] p-6">
  <h2 className="text-lg text-[#e8bd65]">
    Your Order
  </h2>

  <p className="mt-4 text-sm text-[#bfb19d]">
    Edition: <span className="text-[#f2dfbd]">{edition || "No edition selected"}</span>
  </p>

  <p className="mt-3 text-sm text-[#bfb19d]">
    Format: <span className="text-[#f2dfbd]">{format || "No format selected"}</span>
  </p>

  <p className="mt-4 text-sm text-[#bfb19d]">
  Price per copy:{" "}
  <span className="text-[#e8bd65]">
    {unitPrice.toLocaleString()} ETB
  </span>
</p>

<div className="mt-5">
  <label className="mb-3 block text-sm text-[#bfb19d]">
    Choose Quantity
  </label>

  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() =>
        setQuantity((current) => Math.max(1, current - 1))
      }
      className="h-12 w-12 rounded-lg border border-[#bd9145]/50 text-xl text-[#e8bd65]"
    >
      −
    </button>

    <input
      type="number"
      min="1"
      step="1"
      value={quantity}
      onChange={(e) => {
        const value = Number(e.target.value);

        if (
          e.target.value !== "" &&
          Number.isSafeInteger(value) &&
          value >= 1
        ) {
          setQuantity(value);
        }
      }}
      className="h-12 min-w-0 flex-1 rounded-lg border border-[#bd9145]/50 bg-[#090806] px-3 text-center text-lg text-[#f2dfbd] outline-none focus:border-[#e8bd65]"
    />

    <button
      type="button"
      onClick={() =>
        setQuantity((current) =>
          current < Number.MAX_SAFE_INTEGER ? current + 1 : current
        )
      }
      className="h-12 w-12 rounded-lg border border-[#bd9145]/50 text-xl text-[#e8bd65]"
    >
      +
    </button>
  </div>
</div>

<p className="mt-5 border-t border-[#bd9145]/30 pt-4 text-lg text-[#e8bd65]">
  Total: {totalPrice.toLocaleString()} ETB
</p>

{checkingReseller && (
  <p className="mt-3 text-sm text-[#bfb19d]">
    Checking reseller status...
  </p>
)}

{resellerStatus.approved && (
  <div className="mt-4 rounded-lg border border-[#bd9145]/40 bg-[#090806] p-4">
    <p className="text-[#e8bd65]">
      ✓ Approved Reseller — {resellerStatus.commissionRate}%
    </p>

    <p className="mt-3 text-sm text-[#bfb19d]">
      Estimated Reseller Commission:
      <span className="text-[#e8bd65]">
        {" "}{resellerCommission.toLocaleString()} ETB
      </span>
    </p>

    <p className="mt-2 text-sm text-[#bfb19d]">
      Bookstore Owner Amount:
      <span className="text-[#e8bd65]">
        {" "}{ownerAmount.toLocaleString()} ETB
      </span>
    </p>
  </div>
)}

{resellerStatus.checked && !resellerStatus.approved && (
  <p className="mt-3 text-sm text-[#bfb19d]">
    No approved reseller account found for this email.
  </p>
)}

  <p className="mt-3 text-sm text-[#bfb19d]">
  Payment Method:{" "}
  <span className="text-[#e8bd65]">
    {paymentMethod || "Not selected"}
  </span>
</p>
{format === "Printed Book" ? (
  <div className="mt-4 space-y-2 text-sm text-[#bfb19d]">
    <p>
      Delivery Address:{" "}
      <span className="text-[#e8bd65]">
        {deliveryAddress || "Not entered"}
      </span>
    </p>
    <p>
      City:{" "}
      <span className="text-[#e8bd65]">
        {deliveryCity || "Not entered"}
      </span>
    </p>
  </div>
) : format === "Digital Book" ? (
  <p className="mt-4 text-sm text-[#bfb19d]">
    Digital delivery:{" "}
    <span className="text-[#e8bd65]">
      {email || "Email not entered"}
    </span>
  </p>
) : null}
</div>
        <div className="mt-12 space-y-6">
          <div>
            <label className="mb-2 block text-sm">Full Name</label>
         
<input
  value={name}
  onChange={(e) =>
    setName(
      e.target.value.replace(/[^\p{L}\p{M}\s'-]/gu, "")
    )
  }
  placeholder="Enter your full name"
  className="w-full rounded border border-[#bd9145]/50 bg-[#17130e] p-4 outline-none focus:border-[#e8bd65]"
/>

          </div>

          <div>
            <label className="mb-2 block text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
  setEmail(e.target.value);
  setResellerStatus({
    checked: false,
    approved: false,
    commissionRate: 0,
  });
}}
              onBlur={() => checkReseller(email)}
              placeholder="Enter your email"
              className="w-full rounded border border-[#bd9145]/50 bg-[#17130e] p-4 outline-none focus:border-[#e8bd65]"
            />
            <label className="mb-2 mt-4 block text-sm">
  Confirm Email Address
</label>

<input
  type="email"
  value={confirmEmail}
  onChange={(e) => setConfirmEmail(e.target.value)}
  placeholder="Enter your email again"
  className="w-full rounded border border-[#bd9145]/50 bg-[#17130e] p-4 outline-none focus:border-[#e8bd65]"
/>
          </div>

          <div>
            <label className="mb-2 block text-sm">Phone Number</label>
            <input
              value={phone}
             onChange={(e) => {
  setPhone(e.target.value);
  setPhoneError("");
  setError("");
}}
              placeholder="Enter your phone number"
              className="w-full rounded border border-[#bd9145]/50 bg-[#17130e] p-4 outline-none focus:border-[#e8bd65]"
            />
            {phoneError && (
  <p className="mt-2 text-sm text-red-400">
    {phoneError}
  </p>
)}
          </div>

         

<div className="relative">
  <label className="mb-2 block text-sm">Country</label>

  <button
    type="button"
    onClick={() => setShowCountryList(!showCountryList)}
    className="w-full rounded border border-[#bd9145]/50 bg-[#17130e] p-4 text-left text-[#f2dfbd] outline-none focus:border-[#e8bd65]"
  >
    {countryOptions.find((item) => item.name === country)?.flag} {country}
    <span className="float-right">⌄</span>
  </button>

  {showCountryList && (
    <div className="absolute z-50 mt-2 w-full rounded-lg border border-[#bd9145]/50 bg-[#17130e] p-3 shadow-2xl">

      <input
        type="text"
        value={countrySearch}
        onChange={(e) => setCountrySearch(e.target.value)}
        placeholder="🔍 Search country..."
        className="mb-3 w-full rounded border border-[#bd9145]/50 bg-[#090806] p-3 text-[#f2dfbd] outline-none focus:border-[#e8bd65]"
      />

      <div className="max-h-56 overflow-y-auto">
        {countryOptions
          .filter((item) =>
            item.name.toLowerCase().includes(countrySearch.toLowerCase())
          )
          .map((item) => (
            <button
              key={item.name}
              type="button"
             onClick={() => {
  setCountry(item.name);
  setPhone(item.callingCode + " ");
  setCountrySearch("");
  setShowCountryList(false);
}}
              className="block w-full rounded px-3 py-3 text-left text-sm text-[#f2dfbd] hover:bg-[#c99b42]/20"
            >
              {item.flag} {item.name}
            </button>
          ))}

        {countryOptions.filter((item) =>
          item.name.toLowerCase().includes(countrySearch.toLowerCase())
        ).length === 0 && (
          <p className="p-3 text-sm text-[#bfb19d]">
            No country found.
          </p>
        )}
      </div>
    </div>
  )}
</div>


<div className="space-y-5">
  <h2 className="text-xl text-[#e8bd65]">
    Choose Your Payment Method
  </h2>

  <p className="text-sm text-[#bfb19d]">
    Ethiopian Payment Methods
  </p>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {[
      "Telebirr",
      "CBE Birr",
      "M-PESA Ethiopia",
      "Kacha",
      "Amole",
      "HelloCash",
      "Bank Transfer",
    ].map((method) => (
      <button
        key={method}
        type="button"
        onClick={() => setPaymentMethod(method)}
        className={`rounded-lg border p-4 text-sm transition ${
          paymentMethod === method
            ? "border-[#e8bd65] bg-[#c99b42]/20 text-[#e8bd65]"
            : "border-[#bd9145]/40 text-[#f2dfbd] hover:border-[#e8bd65]"
        }`}
      >
        {paymentMethod === method ? "✓ " : ""}
        {method}
      </button>
    ))}
  </div>

  <p className="text-sm text-[#bfb19d]">
    International Payment Methods
  </p>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {["Visa / Mastercard", "PayPal"].map((method) => (
      <button
        key={method}
        type="button"
        onClick={() => setPaymentMethod(method)}
        className={`rounded-lg border p-4 text-sm transition ${
          paymentMethod === method
            ? "border-[#e8bd65] bg-[#c99b42]/20 text-[#e8bd65]"
            : "border-[#bd9145]/40 text-[#f2dfbd] hover:border-[#e8bd65]"
        }`}
      >
        {paymentMethod === method ? "✓ " : ""}
        {method}
      </button>
    ))}
  </div>
</div>
{paymentMethod && (
  <div className="mt-8 rounded-xl border border-[#bd9145]/50 bg-[#17130e] p-6">
    <p className="text-xs tracking-[0.3em] text-[#d9ad5c]">
      PAYMENT DETAILS
    </p>

    <h3 className="mt-4 text-2xl text-[#e8bd65]">
      {paymentMethod}
    </h3>

    <p className="mt-4 text-sm leading-7 text-[#bfb19d]">
      Your selected payment method is {paymentMethod}.
      Verified payment instructions will appear here once
      this provider is officially connected.
    </p>

    <p className="mt-4 text-xs text-red-400">
      Please do not send money until official payment
      instructions are provided.
    </p>
  </div>
)}
{format === "Printed Book" && (
  <div className="mt-8 space-y-5 rounded-xl border border-[#bd9145]/50 bg-[#17130e] p-6">
    <h2 className="text-xl text-[#e8bd65]">
      Delivery Information
    </h2>

    <div>
      <label className="mb-2 block text-sm">
        Delivery Address
      </label>
      <textarea
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
        placeholder="Enter your full delivery address"
        className="w-full rounded border border-[#bd9145]/50 bg-[#090806] p-4 text-[#f2dfbd] outline-none focus:border-[#e8bd65]"
        rows={3}
      />
    </div>

    <div>
      <label className="mb-2 block text-sm">
        City
      </label>
      <input
        value={deliveryCity}
        onChange={(e) => setDeliveryCity(e.target.value)}
        placeholder="Enter your city"
        className="w-full rounded border border-[#bd9145]/50 bg-[#090806] p-4 text-[#f2dfbd] outline-none focus:border-[#e8bd65]"
      />
    </div>
  </div>
)}
{orderConfirmed && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090806] px-6">
    <div className="w-full max-w-lg rounded-2xl border border-[#c99b42]/60 bg-[#17130e] p-8 text-center shadow-2xl">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d9ad5c] text-4xl text-[#e8bd65]">
        ✓
      </div>

      <p className="mt-8 text-xs tracking-[0.4em] text-[#d9ad5c]">
        OUR LAUGHTER IS ONE
      </p>

      <h2 className="mt-5 font-[var(--font-cormorant)] text-5xl text-[#e8bd65]">
        Thank You!
      </h2>

      <p className="mt-5 text-sm leading-7 text-[#bfb19d]">
        Your order has been submitted successfully.
      </p>

      <div className="mt-8 rounded-lg border border-[#bd9145]/40 bg-[#090806] p-5">
        <p className="text-xs tracking-widest text-[#d9ad5c]">
          YOUR ORDER REFERENCE
        </p>
        <p className="mt-3 text-xl text-[#f2dfbd]">
          {orderReference}
        </p>
      </div>

      <p className="mt-6 text-sm leading-7 text-red-400">
        Payment is still pending. Your order will be processed after payment verification.
      </p>

    </div>
  </div>
)}
{showConfirmation && (
  <div className="mt-10 rounded-xl border border-[#c99b42] bg-[#17130e] p-6">
    <p className="text-xs tracking-[0.3em] text-[#d9ad5c]">
      FINAL ORDER REVIEW
    </p>

    <h2 className="mt-4 text-3xl font-[var(--font-cormorant)] text-[#e8bd65]">
      Review Your Order
    </h2>

    <div className="mt-6 space-y-4 text-sm text-[#bfb19d]">
      <p>Customer: <span className="text-[#f2dfbd]">{name}</span></p>
      <p>Email: <span className="text-[#f2dfbd]">{email}</span></p>
      <p>Phone: <span className="text-[#f2dfbd]">{phone}</span></p>
      <p>Edition: <span className="text-[#f2dfbd]">{edition}</span></p>
     <p>Format: <span className="text-[#f2dfbd]">{format}</span></p>

<p>
  Quantity:{" "}
  <span className="text-[#f2dfbd]">
    {quantity.toLocaleString()} copies
  </span>
</p>

<p>Payment: <span className="text-[#f2dfbd]">{paymentMethod}</span></p>

      {format === "Printed Book" && (
        <>
          <p>Address: <span className="text-[#f2dfbd]">{deliveryAddress}</span></p>
          <p>City: <span className="text-[#f2dfbd]">{deliveryCity}</span></p>
        </>
      )}

      <div className="border-t border-[#bd9145]/40 pt-4">
        <p className="text-xl text-[#e8bd65]">
          Total: {totalPrice.toLocaleString()} ETB
        </p>
        {resellerStatus.approved && (
  <>
    <p className="mt-3">
      Reseller Commission ({resellerStatus.commissionRate}%):{" "}
      <span className="text-[#e8bd65]">
        {resellerCommission.toLocaleString()} ETB
      </span>
    </p>

    <p className="mt-2">
      Bookstore Owner Amount:{" "}
      <span className="text-[#e8bd65]">
        {ownerAmount.toLocaleString()} ETB
      </span>
    </p>
  </>
)}
      </div>
    </div>

    <p className="mt-6 text-xs leading-6 text-[#bfb19d]">
      Please review all your information carefully before confirming.
    </p>
    <button
  type="button"
  onClick={handleConfirmOrder}
  className="mt-8 w-full rounded-full bg-[#c99b42] px-6 py-4 text-sm font-semibold tracking-[0.2em] text-black transition hover:bg-[#e8bd65]"
>
  CONFIRM ORDER
</button>
  </div>
)}
{error && (
  <p
    key={warningKey}
    className="warning-shake text-center text-sm font-medium text-red-500"
  >
    ⚠️ {error}
  </p>
)}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-full bg-[#c99b42] px-6 py-4 text-sm font-semibold tracking-widest text-black"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </main>
  );
}
