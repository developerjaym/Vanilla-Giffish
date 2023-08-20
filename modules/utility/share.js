//https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/share
export default function share(
  title,
  text,
  url,
  onSuccess = (message) => {},
  onFailure = (error) => {}
) {
  if (!navigator.share) {
    onFailure("No share ability");
    return;
  }

  navigator.share({ title, text, url }).then(() => onSuccess("Successfully Shared")).catch(onFailure);
}
