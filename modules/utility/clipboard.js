export default function clipboardCopier(shareString, onSuccess, onFailure) {
    if (navigator && navigator.clipboard.writeText(shareString)) {
      onSuccess("Successfully Copied");
    } else {
      onFailure("ERROR: Failed to Copy");
    }
  }