//https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/share
export default function share(
  title,
  text,
  url,
  onSuccess = () => {},
  onFailure = (error) => {}
) {
  if (!navigator.share) {
    onFailure("No share ability");
    return;
  }

  navigator.share({ title, text, url }).then(onSuccess).catch(onFailure);
}
