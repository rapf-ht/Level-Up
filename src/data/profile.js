const DEFAULT_PROFILE = { name: "Jggranito", playerClass: "Guerreiro" };

export function getProfile() {
  const saved = localStorage.getItem("profile");
  return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
}

export function saveProfile(profile) {
  localStorage.setItem("profile", JSON.stringify(profile));
}
