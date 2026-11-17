export type PlatformGuide = {
  label: string; title: string; intro: string;
  items: { title: string; text: string; example?: string; image?: string }[];
  saveTitle: string; saveText: string; saveImage?: string;
  faqTitle: string; questions: [string, string][];
};

export const PLATFORM_GUIDANCE: Record<string, PlatformGuide> = {
  youtube: {
    label: "Link and playback help", title: "Choose The Correct YouTube Address",
    intro: "Use a watch or Shorts address for the recording you want. A playlist can help you find it, but the request needs that video’s own link.",
    items: [
      { image: "/images/youtube/guide-individual.webp", title: "Select A Playlist Item", text: "Open the chosen video from the playlist before copying. This prevents the collection address from replacing the recording you meant to request.", example: "youtube.com/watch?v=VIDEO_ID" },
      { image: "/images/youtube/guide-timestamp.webp", title: "Save The Full Recording", text: "A shared timestamp changes where playback begins on YouTube. This tool has no trimming control, so that timestamp does not set a download start point.", example: "youtu.be/VIDEO_ID?t=30" },
      { image: "/images/youtube/guide-modes.webp", title: "Check Audio In The Source", text: "Listen to the original if your saved file is silent. Then check the selected mode and the volume in your local player." },
      { image: "/images/youtube/guide-source.webp", title: "Keep A Useful Error Report", text: "For a repeated failure, note the public video URL and the message beneath the input field. Support can use those details to identify the request." },
    ],
    saveTitle: "Open The Finished File", saveText: "Use the browser’s completed download entry to find the recording. If a player refuses it, check the extension before selecting another app. An interrupted transfer may need a fresh request.",
    faqTitle: "Playback And File Questions", questions: [
      ["Can I download only a short section?", "The page has no start or end controls. You would need to edit a downloaded recording separately, with permission for that use."],
      ["Can I save a result for another device?", "You can move your completed file to another device using your usual file transfer method. Keep the original URL if you need to request it again."],
    ],
  },
  tiktok: {
    label: "Post types", title: "Choose The TikTok Content You Need", intro: "A clip, its audio and a photo post can produce different results. The address should belong to the individual post you have selected.",
    items: [
      { image: "/images/tiktok/guide-video.webp", title: "Identify The Recording", text: "Open the video before using Share. The address pattern below includes the creator and the specific video identifier.", example: "tiktok.com/@creator/video/VIDEO_ID" },
      { image: "/images/tiktok/guide-sound.webp", title: "Use The Linked Soundtrack", text: "Audio only works from the recording you submit. A sound page can list many clips, so choose the individual one whose audio you need." },
      { image: "/images/tiktok/guide-slideshow.webp", title: "Check A Photo Post", text: "If a photo request returns several images, select them from the result. The returned set determines which items are ready to save." },
      { image: "/images/tiktok/guide-credit.webp", title: "Retain The Source Details", text: "Keep the post address if you need to revisit the creator or identify the recording later. Downloaded filenames may not carry all that information." },
    ],
    saveTitle: "Check Permission Before Reposting", saveText: "Before sharing or editing a saved clip, check the creator’s permission and any licence conditions. Removing a platform mark does not change the rights in the recording.",
    faqTitle: "TikTok Download Questions", questions: [
      ["What should I do with a failed short link?", "Open the shared address in your browser and let it reach the video. Copy that page’s full URL into the tool for another request."],
      ["Can I choose a sharper version?", "There is no TikTok resolution menu here. The result depends on the available recording, and conversion cannot recover detail lost before upload."],
      ["Can I remove a creator’s caption?", "The downloader has no control for erasing text within the picture. Captions and logos added by the creator remain visible."],
      ["Does a download give me permission to share?", "You still need the rights required for your intended use. If the post provides no clear licence, ask the creator before publishing a copy."],
    ],
  },
  instagram: {
    label: "Carousel results", title: "Save And Check Your Carousel", intro: "Photos and recordings can share the same post. Compare the returned items with its slides before deciding which files to keep.",
    items: [
      { title: "Open The Carousel Post", image: "/images/instagram/guide-post.webp", text: "Copy the carousel’s post address. A profile URL cannot identify the set shown in the example below.", example: "instagram.com/p/POST_ID/" },
      { title: "Match The Slide Thumbnails", image: "/images/instagram/guide-attachments.webp", text: "Match each thumbnail to the slide you wanted. Choose its image or video button, or start the returned set with Download all." },
      { title: "Check The Completed Set", image: "/images/instagram/guide-saved-set.webp", text: "Look through your browser’s transfer list after a batch. A blocked or interrupted item may need saving separately." },
    ],
    saveImage: "/images/instagram/guide-camera-roll.webp", saveTitle: "Move Media To Your Photo Library", saveText: "A completed file may remain in Downloads until you move it. On an iPhone, open it in Files and use Save Image or Save Video from Share if offered. Android users can open it through their file manager.",
    faqTitle: "Instagram File Questions", questions: [
      ["Does Download all make a single archive?", "It starts the returned items individually. The tool does not package the carousel into one ZIP file or join its clips together."],
      ["Why did only some slides download?", "A slide may have failed during retrieval or transfer. Compare the post with the returned set and your download list to identify the missing item."],
      ["Does the result include captions or comments?", "The tool retrieves media files. It does not provide a separate export of the post’s written caption, replies or account information."],
      ["Can I request an unavailable post again?", "A later retry may help after a temporary error. It cannot restore a deleted post or give the service access to a private account."],
    ],
  },
  facebook: {
    label: "After retrieval", title: "Save Your Facebook Video Result", intro: "Use the file button after identifying the recording. Watching an embedded preview does not save a copy to your device.",
    items: [
      { title: "Identify The Returned Reel", image: "/images/facebook/guide-preview.webp", text: "Compare the result with the post you selected. If you copied a page containing several recordings, open the intended one and share its own address." },
      { title: "Choose The Video File", image: "/images/facebook/guide-download.webp", text: "The result’s MP4 button starts the transfer. This page has no Facebook quality selector, so the source controls the version supplied." },
      { title: "Locate The Completed Download", image: "/images/facebook/guide-find-file.webp", text: "Open the browser’s download list after the transfer finishes. That entry is the quickest route to the folder it used." },
    ],
    saveTitle: "Add A Saved Clip To Photos", saveText: "On an iPhone, open the video in Files and check the Share menu for Save Video. If a gallery app has not listed the clip on Android, open it from the file manager.",
    faqTitle: "Facebook File And Playback Help", questions: [
      ["Can I request several videos at once?", "Submit the address of one recording at a time. A page or album URL does not start a batch of Facebook downloads."],
      ["Why is my completed video silent?", "Check the source recording, your player volume and the mode selected when you submitted the request. Auto asks for the video with its available soundtrack."],
      ["Should I keep the download button’s address?", "Keep the original post URL for future requests. A generated media address may expire, so it is not a reliable way to revisit the source later."],
      ["Can this improve a blurred clip?", "No quality control here can add detail missing from the recording. The available source sets the limit for the downloaded picture."],
    ],
  },
  twitter: {
    label: "Attachment help", title: "Choose Individual Files From A Post", intro: "Look through the returned media before starting a batch. A picture set can contain items you want to keep separately.",
    items: [
      { title: "Use The Attachment’s Post", image: "/images/twitter/guide-original.webp", text: "The status address identifies the post containing the media. For a quoted attachment, open the original post and copy its link.", example: "x.com/creator/status/POST_ID" },
      { title: "Save Selected Pictures", image: "/images/twitter/guide-photos.webp", text: "Choose the image buttons individually if you only need part of a set. Download all starts each item returned by the request." },
      { title: "Check An Animation’s Extension", image: "/images/twitter/guide-animation.webp", text: "Read the downloaded filename before importing an animation into another app. An MP4 may need converting in an editor that expects a GIF." },
    ],
    saveTitle: "Keep Track Of The Original Post", saveText: "Store the source address with a file when you need to revisit it or record creator details. Your browser’s download folder holds the media, but may not preserve the original post text.",
    faqTitle: "X And Twitter Download Help", questions: [
      ["Can I save text and replies with the media?", "The tool does not export a thread or its replies. It retrieves media attached to the individual post you submit."],
      ["Must I replace twitter.com with x.com?", "You can submit either recognised host. There is no need to edit a working post address by hand."],
      ["What happens if a photo is missing?", "Compare the original post with the returned thumbnails. An item that failed to load may require another request, while a failed transfer can be retried from its button."],
      ["Is there a GIF conversion setting?", "There is no GIF encoder on this page. Save the supplied file and use a separate editing app if you need another format."],
    ],
  },
  pinterest: {
    label: "Image and source details", title: "Check The Saved Pin File", intro: "A pin can link to another website as well as display media. The download controls concern the image or clip returned from Pinterest.",
    items: [
      { title: "Identify The Pin", image: "/images/pinterest/guide-address.webp", text: "Use the pin’s own URL. A board may contain several similar images, so opening the item first helps you select the intended one.", example: "pinterest.com/pin/PIN_ID/" },
      { title: "Read The File Dimensions", image: "/images/pinterest/guide-dimensions.webp", text: "Open the saved image’s information on your device to see its width and height. The display size of a preview does not establish those dimensions." },
      { title: "Keep The External Page Link", image: "/images/pinterest/guide-website.webp", text: "If the pin links to instructions or an article, save that website address separately. Downloading the picture does not copy the linked page." },
    ],
    saveImage: "/images/pinterest/guide-source-tag.webp", saveTitle: "Store The Pin With Its Context", saveText: "A picture may be easier to find later if you give it a descriptive filename. Keep its source URL alongside it when you need the instructions, attribution or creator details attached to the pin.",
    faqTitle: "Pinterest Image Questions", questions: [
      ["Can I save a collection in one request?", "Choose a single pin from the board. The page has no control for downloading every item in a collection."],
      ["Why are the dimensions different from the preview?", "The preview can scale an image to fit the page. Your saved file uses the dimensions of the source returned by the service."],
      ["What if a pin.it address redirects incorrectly?", "Open the intended pin directly on Pinterest and copy its full URL. Check its picture or video before submitting that address."],
      ["Can I publish the artwork elsewhere?", "Check the licence or obtain permission for that use. Public visibility alone does not give you rights to republish another person’s image."],
    ],
  },
  snapchat: {
    label: "Profile and clip links", title: "Select A Story Or Spotlight Link", intro: "Use a public profile to request its current story. A particular Spotlight recording needs its own clip address.",
    items: [
      { title: "Choose A Spotlight Video", image: "/images/snapchat/guide-spotlight.webp", text: "Open the recording itself and copy its sharing link. This identifies the clip independently of other videos on the creator’s profile." },
      { title: "Request The Current Story", image: "/images/snapchat/guide-story.webp", text: "Copy the public profile address for its active snaps. The story may change between opening the profile and submitting the request.", example: "snapchat.com/add/USERNAME" },
      { title: "Review The Returned Items", image: "/images/snapchat/guide-results.webp", text: "Review the snaps listed in the result, then select the ones you want to keep. The number of items depends on the public story currently available." },
    ],
    saveTitle: "Keep Story Files In Order", saveText: "Each returned snap downloads separately. Use a folder to group the completed items if you want to keep the set together. Check for failed transfers before moving or renaming them.",
    faqTitle: "Snapchat Result Questions", questions: [
      ["Can I retrieve yesterday’s expired story?", "Expired snaps are unavailable to this downloader. You would need an existing saved copy or another source supplied by the creator."],
      ["Does a profile link include private messages?", "The request looks for public story media. It does not access conversations or private snaps sent to an account."],
      ["Why has the number of snaps changed?", "Some snaps may have expired or been removed since your earlier request. A retrieval error can also leave items missing, so compare the result with the active story."],
      ["Can I combine the story into one video?", "This tool provides separate files and has no joining control. You would need an editor to combine recordings you have permission to use."],
    ],
  },
  dailymotion: {
    label: "Video address help", title: "Check Your Dailymotion Source Link", intro: "A direct address identifies the recording the service should retrieve. Use the examples to recognise a video URL before submitting it.",
    items: [
      { title: "Use A Direct Video URL", image: "/images/dailymotion/guide-direct.webp", text: "Copy the video page URL. VIDEO_ID marks where the real identifier belongs in this example.", example: "dailymotion.com/video/VIDEO_ID" },
      { title: "Follow A Short Share Link", image: "/images/dailymotion/guide-short-link.webp", text: "A dai.ly share address redirects to a recording. If it stops resolving, use the full URL from the destination page.", example: "dai.ly/VIDEO_ID" },
      { title: "Identify The Video Result", image: "/images/dailymotion/guide-result.webp", text: "The result shows which media the service could retrieve. Use its file button to save a copy; embedded playback alone does not start that transfer." },
    ],
    saveImage: "/images/dailymotion/guide-local-player.webp", saveTitle: "Check Playback After Downloading", saveText: "Open the completed recording in a player that accepts its format. If playback stops early, check whether the browser marked the transfer as incomplete before trying a new request.",
    faqTitle: "Dailymotion Download Questions", questions: [
      ["Can I choose the folder before saving?", "That depends on your browser settings. Turn on its option to ask where to save files if you want to choose a location for each download."],
      ["How can I paste without the Paste button?", "Select the input field and use your device’s paste menu, Ctrl+V or Command+V. The field accepts the copied address directly."],
      ["Can I listen without downloading a video?", "Choose Audio only to request the soundtrack. When audio is returned, use its MP3 button to save it for a compatible player."],
      ["Does the embedded player mean retrieval succeeded?", "An embedded player can load directly from Dailymotion. You need a returned file option and a completed browser transfer to have a local copy."],
      ["Can I share the generated file link later?", "Media links may expire. Keep the original Dailymotion address and make another request when you need a fresh result."],
      ["What should I report after repeated failures?", "Send the public video URL, the displayed message and your browser and device. Those details help distinguish a source error from a transfer problem."],
      ["Does a channel URL save all its videos?", "Open the individual recording from the channel first. This tool does not offer a channel batch request."],
      ["Is there a Dailymotion quality menu?", "The page uses the version supplied by the retrieval service. You cannot select a resolution for Dailymotion here."],
      ["Can I download a subtitle file?", "There is no separate subtitle export. Text already within the video picture remains visible in the recording."],
    ],
  },
  bilibili: {
    label: "Parts and player features", title: "Review A Bilibili Video Result", intro: "Player features can include parts, scrolling comments and subtitles. Check the returned file options before assuming those features will be included.",
    items: [
      { title: "P1 / Identify The Recording", image: "/images/bilibili/guide-video.webp", text: "Open the individual recording and copy its address. The video link identifies which item you want to save.", example: "bilibili.com/video/BV…" },
      { title: "P2 / Check The Selected Part", image: "/images/bilibili/guide-part.webp", text: "Copy the address after choosing the part you need. Check that the downloaded recording matches your selected part." },
      { title: "P3 / Check Visible Text", image: "/images/bilibili/guide-overlays.webp", text: "The tool does not export separate comments or subtitle files. Text already included within the recording stays in the picture." },
    ],
    saveImage: "/images/bilibili/guide-save.webp", saveTitle: "Confirm Which Recording Was Saved", saveText: "Open the completed download and check the title, duration and content against your selection. A series or parts list on the source page does not mean every item was downloaded.",
    faqTitle: "Bilibili Request Questions", questions: [
      ["Which Bilibili link should I use?", "Use the address of an individual public video on bilibili.com or bilibili.tv. You can also paste its b23.tv share link."],
      ["What if a b23.tv link does not open here?", "Follow the shared link in your browser and copy the destination video’s full address. Submit that URL if the redirect was the problem."],
      ["Can I export the moving comments?", "There is no danmaku download control. The animated text on this page is part of its illustration and is separate from the source video."],
      ["Would my account details help?", "Do not send passwords or account cookies. The downloader does not take your browser session, and restricted access cannot be transferred through the link field."],
    ],
  },
  vk: {
    label: "VK video selection", title: "Identify The Recording Within A Post", intro: "A community can display a recording without making its own page address the video URL. Open the media to obtain the specific link.",
    items: [
      { title: "Open A Community Video", image: "/images/vk/guide-community.webp", text: "Choose the video player within the post and open the recording. Check that the title matches the clip you intended to save." },
      { title: "Use The Recording’s Share Control", image: "/images/vk/guide-link.webp", text: "Use Share or Copy link on the recording. The zeros below illustrate the address pattern and must be replaced by a real video link.", example: "vkvideo.ru/video-00000_000" },
      { title: "Check A Returned Result", image: "/images/vk/guide-result.webp", text: "Compare the preview or filename with your selected recording, then use its download button. The source determines the available resolution." },
    ],
    saveImage: "/images/vk/guide-library.webp", saveTitle: "Organise Your Completed Recording", saveText: "Use your browser’s completed transfer to find the file. Rename it if needed, and keep the source address separately for a future request or a support report.",
    faqTitle: "VK Download Questions", questions: [
      ["Can I submit a feed address?", "Select the recording from the feed first. A feed URL does not specify which of its videos the tool should retrieve."],
      ["Will switching VK domains bypass a restriction?", "Changing the hostname does not grant access to a private or removed video. The source’s access settings still apply."],
      ["Can I select a VK resolution?", "This tool has no VK quality menu. Check the returned file because its resolution depends on what the service can obtain."],
      ["Why did a later request for the same video fail?", "Check whether the recording still opens publicly. A creator may remove it or change its access settings after an earlier download."],
    ],
  },
};
