// ---------------- SUPABASE INIT ----------------
const supabaseUrl = "https://dmoljjsmmvtajwfpahao.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtb2xqanNtbXZ0YWp3ZnBhaGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTg0NDIsImV4cCI6MjA5ODA3NDQ0Mn0.yNXVSJQTh-mB4wsTfQB3-h_pLmXRF-KhWIi18L_x6_M"; // MUST be real anon key

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ---------------- LOAD MESSAGES ----------------
async function loadMessages() {
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Load error:", error.message);
    return;
  }

  renderMessages(data || []);
}

// ---------------- POST MESSAGE ----------------
async function postMessage() {
  const name =
    document.getElementById("name").value.trim() || randomName();

  const text = document.getElementById("text").value.trim();

  if (!text) return;

  const { error } = await supabaseClient
    .from("messages")
    .insert([{ name, text, likes: 0 }]);

  if (error) {
    console.error("Insert error:", error.message);
    return;
  }

  document.getElementById("text").value = "";
  loadMessages();
}

// ---------------- LIKE MESSAGE ----------------
async function likeMessage(id, currentLikes) {
  const { error } = await supabaseClient
    .from("messages")
    .update({ likes: currentLikes + 1 })
    .eq("id", id);

  if (error) {
    console.error("Update error:", error.message);
    return;
  }

  loadMessages();
}

// ---------------- RENDER ----------------
function renderMessages(messages) {
  const container = document.getElementById("messages");
  container.innerHTML = "";

  messages.forEach((m) => {
    container.innerHTML += `
      <div class="message">
        <b>${m.name}</b><br>
        ${m.text}<br>
        :heart: ${m.likes}
        <button onclick="likeMessage('${m.id}', ${m.likes})">Like</button>
      </div>
    `;
  });
}

// ---------------- UTIL ----------------
function randomName() {
  return "User_" + Math.floor(Math.random() * 9999);
}

// ---------------- INIT ----------------
loadMessages();