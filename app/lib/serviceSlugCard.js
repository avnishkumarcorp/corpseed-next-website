export async function getServiceCardBySlug(payload) {
  try {
    const response = await fetch(`/api/customer/services/service-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch service card");
    }

    return await response.json();
  } catch (error) {
    console.error("getServiceCardBySlug error:", error);
    return null;
  }
}