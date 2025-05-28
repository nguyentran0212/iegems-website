---
title: "Tanchjim Stargate II - Simplicity"
layout: "single"
excerpts: "Simplicity"
toc: true
header:
    image: "/assets/images/R6-Pro-Max/R6ProMax_Summary.jpg"
---

Can we improve upon the venerable Apple Dongle? 

No, those USB stick DACs do not count since they are bulkier and much more intensive on the battery of your phone. No, I'm thinking about something as small and light and energy efficient as Apple Dongle, but "better." Tanchjim believes they have an answer with Stargate II. Let's have a look.

![](/assets/images/Tanchjim-StargateII/Starlight_12.jpg)

Preambles
===
- In this review, I use the term "source" to denote a DAC+amp combo for brevity and convenience. 
- Sources do not make sounds. Therefore, when I say sources "sound" a certain way, I talk about the change they make to my IEMs and earphones. 
- I want my music to be crisp, clear, well-separated and form a 3D soundstage around my head. Sources that intensify those characteristics of my IEMs are considered "better". 
- The unit used for this review was a sample provided by Hifigo (Thank you!). The unit is retailed for $37.99 and can be found on [Hifigo Web Store (non-affiliated link)](https://hifigo.com/collections/tanchjim/products/tanchjim-stargate2).

General Information 
===

The Tanchjim Stargate II is a lightweight USB Type-C digital-to-analog converter (DAC) dongle. Its design can be described as an upscaled version of the humble "Apple Dongle". All of the electronics are housed within an aluminium chassis that also serves as the USB-C male plug whilst the 3.5mm female connector is housed within a separated component, connected to main chassis via a braided insulated copper wire. 

At its core, the Stargate II combines a Cirrus Logic CS43131 DAC chip with a proprietary control chip developed by Tanchjim, which enables 8-band parametric equalizer (PEQ). To control this EQ feature, you would need to use a companion app on your phone. 

The specifications of Stargate II, as expected by any modern devices built around IC-based DAC chips, are stellar: signal-to-noise ratio (SNR) exceeding 127 dB, dynamic range around 127.5 dB, total harmonic distortion (THD) of approximately 0.0002%, crosstalk at −72 dB into a 32 Ω load, and noise floor sitting at a vanishing level of 1.1 μV RMS. The max power output is rather modest at 82mW@16Ω and 75mW@32Ω, but can still blow your ears out if you are an IEM listener. The unit supports PCM audio playback at resolutions up to 32-bit/384kHz and native DSD decoding up to DSD256.

Similar to Apple Dongle, Stargate II supports mic input, so you can use it with gaming headsets. This capability also opens up unexpected use cases, such as using the DAC as a soundcard to measure frequency response of other IEMs.

Functionality 
===

What can R6 Pro Max do? This device offers 4 operating modes, accessible via the "Working Mode" option in the pull down menu. 

![](/assets/images/R6-Pro-Max/R6ProMax_13.jpg)
![](/assets/images/R6-Pro-Max/R6ProMax_25.png)
![](/assets/images/R6-Pro-Max/R6ProMax_26.png)

**Android Mode**: As you would expect from an Android-based music player, there is a variety of things you can do with this device beyond playing local music files. Whilst the Snapdragon 665 is nearly 6 years old, it is still capable enough to provide a smooth experience when navigating the OS, browsing web, watching Full HD YouTube videos, and, of course, streaming music from TIDAL. You can even emulate retro games on this device up to Playstation Portable at native resolution. That said, the chip is showing its age as more bleeding edge use cases such as running a large language model locally is beyond its reach. For example, when I use MLC Chat application to run small language models such as Phi3.5-Mini on the device, the application crashes before finishing to load the model. It is unknown whether the problem is caused by lack of software libraries in the custom Android implementation of Hiby, lack of hardware features in the Snapdragon 665, or simply the lack of system RAM. Still, if you stay away from bleeding edge use cases and stick to music and video streaming, R6 Pro Max is perfectly adequate and would likely to remain so for a while.

![](/assets/images/R6-Pro-Max/R6ProMax_27.jpg)
![](/assets/images/R6-Pro-Max/R6ProMax_14.jpg)

**Pure Audio Mode**: If you want to get away from the distraction of Android and focus on music, this mode is for you. It locks R6 Pro Max to the HiBy music app and prevents you from switching away, meaning you cannot access your Tidal or YouTube app. However, you can still setup Tidal and Qobuz streaming from inside HiBy music app should you need it. I'm unable to hear any practical change in the sonic performance of R6 Pro Max when switching from Android to Pure Audio Mode. Since the Android pull down menu is still accessible inside Pure Audio Mode, I'm inclined to believe that Pure Audio Mode is simply a tweaked version of Android mode rather than a reboot into a different operating system, and thus unlikely to produce any sonic difference.

![](/assets/images/R6-Pro-Max/R6ProMax_7.jpg)

**USB DAC Mode**: As the name implies, this mode turns R6 Pro Max in a USB DAC for your computer. I tested this feature sucessfully with my MacBook Pro with M1 chip and latest version of macOS. Whilst the audio quality is indeed good, R6 Pro Max still has the same problem that plagued other Android DAP when used as a USB DAC: latency. There is a noticeable gap between the visual content on the screen and the audio content from the DAP, limiting the usefulness of this combination to pure audio playback. This drawback is to be expected, but I still find it rather disappointing as something like R6 Pro Max could be an all-in-one solution for both desktop and portable uses.

**Bluetooth Mode**: R6 Pro Max can send audio to bluetooth headphones as well as receiving bluetooth audio from your phone or computer. It supports UAT, LDAC, SBC, and AAC for both input and output. In addition to these codecs, it can also output aptX and aptX HD. When I tested the bluetooth receiving mode with my iPhone XR, I found the connection via AAC to be quite stable, even when the DAP is a few drywalls away from from the phone. However, the latency was very bad, nullifying the possibility of using R6 Pro Max as a bluetooth DAC for media consumption. 

Software
===

R6 Pro Max runs a customised version of Android 12 modified by HiBy. Unlike some other DAPs from China, R6 Pro Max is preloaded with Google Play Store and necessary Google services to ensure that users in Google's ecosystem can quickly gain access to their applications, and software compatility issues are kept to minimum. In fact, I did not run into any unexpected hiccups with software compatibility, even when I tested relatively unusual software for a DAP like retro game emulators. In case you don't want to associate your Google account with a DAP, you can use third party app stores like APKPure to sideload applications without any problem. 

The main customisation done by HiBy lies in the audio stack. Like other Android DAPs, R6 Pro Max features system-wide *bypass* of Android's resampling (i.e., [Sample Rate Conversion or SRC](https://source.android.com/docs/core/audio/src)), meaning the digital audio content coming out from whatever app you use, be it the built-in music playing app of HiBy, Tidal, or YouTube, are faithfully transferred to the DACs rather than being converted to 48kHz sample rate by Android. Another advantage of this implementation by HiBy is the possibility of applying equalizers and various DSP plugins on any digital audio content coming out of any app the device. It means you can set a system-wide EQ for a particular pair of IEM and be sure that this EQ would be applied consistently regardless of what app you use. 

![](/assets/images/R6-Pro-Max/R6ProMax_9.jpg)
![](/assets/images/R6-Pro-Max/R6ProMax_28.png)
![](/assets/images/R6-Pro-Max/R6ProMax_29.png)

**Audio Settings:** You control the audio stack of R6 Pro Max by accessing the "Audio settings" menu within the Settings. In terms of the settings for the audio hardware, your options are limited to setting the gain of the amplifier and setting the low-pass antialiasing filter for the DAC. Keen readers would find that the ability to switch between class A and class AB amplifier from the previous generation R6 Pro II is no longer present with R6 Pro Max. Of course, all of the interesting filters and harmonic control of DARWIN DACs found on RS6 and RS8 are also not available on R6 Pro Max. From this perspective, R6 Pro Max is surprisingly straightforward and less customisable compared to the usual standard of HiBy DAPs. Whether this is a pro or a con is up to you. 

![](/assets/images/R6-Pro-Max/R6ProMax_30.png)

Whilst the hardware options are scaled back, the whole suite of software tweaks are present here. You would find HiBy's famous MSEB system, which is essentially a parametric EQ cleverly disguised as a set of sliders to adjust different subjective aspects of sound like "cool" or "warm" sound temperature, recessed or forward voices. The latest version of MSEB allows you to save and share your MSEB profiles. HiBy themselves provide four profiles: (1) "Hot Monster Output" for folks who like treble, (2) "Analog" for warm and oldschool sound, (3) Ultra Hifi for a powerful "W-shaped" sound signature (big subbass, subdued midbass, forward midrange, controlled treble, a lot of upper treble "air"), and finally (4) "Digital" which makes very slight adjustments toward a mid-centric signature. 

![](/assets/images/R6-Pro-Max/R6ProMax_32.png)

If you find MSEB too abstract and obscure with all the "audiophile lingos", or you need to EQ very precisely to correct an error of your IEM, you can use the full 10-band parametric EQ (PEQ) instead. The PEQ implementation, to me, is a highlight of the audio suite of R6 Pro Max and simply one of the best PEQ I have ever used. I'm not just talking about the actually algorithm under the hood to implement the PEQ, which I find to be perfectly "transparent". No, the highlight of HiBy's PEQ implementation here is the interactive and well-designed user interface. As you know, a PEQ profile is made up of multiple filters, which would interact with each other to form the final, composite effect on the frequency response of an IEM. Where HiBy's PEQ implementation does so well how easy and responsive it is to place and adjust the filters, just by swiping the sliders, and see the combined effect of the filters updated in real time. Moreover, HiBy is sensible enough to put a proper frequency response graph with clearly labeled X and Y axis, making it very easy to see how wide or narrow each filter is. Thus, the act of setting up a PEQ for an IEM becomes somewhat like an interactive and addicting game.

![](/assets/images/R6-Pro-Max/R6ProMax_31.png)

The DSP plugins are another way your can adjust the sound of IEMs with R6 Pro Max. The stars of the show here are "Convolution filter" and "DRX10K Dynamics". The former allows you to apply interesting effects such as speaker virtualisation, which can trick you into hearing sound coming from outside the head (pretty uncanny, beyond the limit of what IEM "soundstage" can do). The latter is a form of dynamic adjustment that kicks in only when transients (jumps in loudness) happen to boost or cut some frequencies during those transients. It means you can avoid adding bass all the time and making the midrange "muddy", yet you can still have a precise bass boost only when bass attacks happen to make your IEMs thumpy and lively. Usually, you need to change the amplifier if you want to improve the dynamic, but with DRX10K plugin, you can mimic that effect purely from software. I find this plugin a game changer for smaller DAPs such as HiBy R4. However, I did not find the need to use DRX10K with R6 Pro Max, given the prowess of its amplifier circuitry. 

The remaining settings are necessary, though less exciting. We have DSD gain compensation, channel balance, max volume, the ability to turn on MQA decoding, and the ability to lock SPDIF and USB digital volume. 


Battery Life
===

Some of the most notable aspects of R6 Pro Max would be its thickness and weight, which are necessary to accommodate a large 8200mAh battery. Does this large battery translate to stellar battery life? Mostly yes.

![](/assets/images/R6-Pro-Max/R6ProMax_10.jpg)

**Runtime:** To assess the battery of R6 Pro Max, I use the AccuBattery application to gather detailed energy consumption data of the device during a test workload that lasted for an hour. This workload features a mixed usage of HD video streaming via the official YouTube application, offline music playback using HiBy Music, and hi-res streaming via Tidal. The onboard amplifier was set to medium gain at the volume level of 27/100, which was enough to reach moderate loudness via the balanced 4.4mm output. For this test, I used Pula ANVIL114, an average IEM in terms of impedance (16.5ohm) and sensitivity (105dB/mW). 

By the end of the mixed usage test, AccuBattery reported a combined usage of 1014mAh or 11.2 percentage, leading to a predicted runtime of up to 9 hours. This figure precisely matches the 9 hours estimation of HiBy and a significant improvement over the 5-7 hours runtime of the previous R6 Pro 2. That said, 

AccuBattery shows a combined usage of 1014mAh or 11.2 percentage per hour, leading to a predicted runtime of up to 9 hours. This usage includes a combination of full screen YouTube videos, offline music playback using HiBy music app, and hi-res streaming via Tidal. The amplifier was set to medium gain, volume 27/100 and output to a normal IEM in terms of impedance and sensitivity (Pula ANVIL114) via balanced output. This figure falls within the estimation from HiBy. Subjectively, 9 hours of runtime is enough to avoid giving me battery anxiety. That said, given the size of R6 Pro Max, I was, perhaps unreasonably, hoping for ultra-long battery life like the 19 hours endurance of the R3II. That's certainly not the case here.

![](/assets/images/R6-Pro-Max/R6ProMax_16.jpg)

**Standby:** An aspect where R6 Pro Max absolutely impressed me was the standby time. Let me give you an anecdote. I picked up this device from the post in a hurry on 29/12 started a long international trip with this device on the following day. Out of the box, R6 Pro Max had around 80% battery. I used the device on and off, half an hour here, 15 minutes there, once in every other days, and left the device on standby for the remaining time. It took two weeks with this workload for me to drain R6 Pro Max down to 20%. With that being said, I have also seen battery dropping over 10% overnight due to the constant polling of some applications, preventing the device from going into deep sleep state. It is not a frequent problem, fortunately.

![](/assets/images/R6-Pro-Max/R6ProMax_17.jpg)

**Charging:** Another aspect where R6 Pro Max impresses is the charging time. When I connect R6 Pro Max to my 100W charger to let it draws as much power as it can, AccuBattery reported the max battery charging rate at over 35W, or about 87% per hour. On average, the charging rate seems to stabilize around 25W. In general, you can top up quite a bit of listening time with a short charging session, you can fill up the entire battery within 2 hours. If you are worried about wear and tear on the battery, you can also set a charge limit within the battery settings of the device. 


Sonic Performance
===

*Note: Comparisons in this section were based on A/B tests where participating devices were volume-matched to 73dB with a coupler using pink noise. Unless mentioned otherwise, AFUL Cantor was used as the IEM in the comparisons.*

![](/assets/images/R6-Pro-Max/R6ProMax_23.jpg)

The first impression I got when listening to the R6 Pro Max was how lively or **dynamic** my familiar IEMs sounded with this DAP. The ones already dynamic become more thrilling, while those in the "borderline" group get a push to cross the line. This perceived improvement in dynamics doesn’t come from an overt bass boost but from a combo of a few intangible aspects the R6 Pro Max excels at. First is the wide contrast between silence and loud elements in a recording, like the peak volume of a bass note or an orchestral accent. This contrast is enabled by both the **pitch black** background and the ability to reproduce louder sounds against this background without any perceived compression.

![](/assets/images/R6-Pro-Max/R6ProMax_11.jpg)
![](/assets/images/R6-Pro-Max/R6ProMax_12.jpg)

The second factor contributing to the R6 Pro Max's liveliness is how it renders note attacks. Every instrument and element in the mix starts at the right moment and effortlessly reaches peak loudness. This transient response, combined with the pitch black background, creates a clean, precise presentation, making complex mix elements just "pop up." This also enhances the perceived layering of sound elements, especially when they overlap on the soundstage. As a result, many recordings gain a **"holographic" or "3D" impression**, where sound elements pop from a blank canvas at different angles and distances.

![](/assets/images/R6-Pro-Max/R6ProMax_19.jpg)

The third aspect is its handling of subbass. Put simply, this DAP controls subbass rumble without sacrificing power. With tracks featuring noticeable subbass rumble, I not only hear and feel the full power, but I also discern a sense of *texture* in the bass line, as if each micro vibration gets the same incisiveness the R6 Pro Max offers to larger transients. This control over bass response is even more noticeable with bass guitars, double basses, and in comparisons against other DAPs, DACs, and amps.

Beyond dynamics and precision, the R6 Pro Max also excels in micro details. I particularly enjoy the extra nuances and texture discernible in most vocal music in my library. While the detail retrieval capability isn’t at an unheard level, its absence is felt clearly in A/B tests against some source devices in my collection.

![](/assets/images/R6-Pro-Max/R6ProMax_20.jpg)

**Pairing with Special IEMs**: First, let’s talk about IEMs with ultra-high sensitivity and low impedance, like the Campfire Audio Andromeda 2020. Unfortunately, the pitch black background is somewhat compromised with this IEM (a faint background noise on medium gain). However, the R6 Pro Max's dynamic advantage remains, giving the Andromeda 2020 the push it needs for a complete and fun sound.

The second type includes low sensitivity and low impedance IEMs, which are tough to drive for most portable DAPs and DAC+amp combos. Here, I used the old faithful Final Audio E5000. The R6 Pro Max aced this test—no mushy transients or small soundstage. Actually, the bass power of the E5000 got too much for me with this pairing.

![](/assets/images/R6-Pro-Max/R6ProMax_21.jpg)

**Comparisons**:

- **HiBy R3II (Micro DAP)**: Impressively, the R3II keeps up in terms of soundstage spaciousness. However, it falls short in bass power, control, and transient response. The subbass rumbles feel weaker, mushier, and less textured. The less incisive transients of the R3II nearly erase the holographic and 3D impression in the AFUL Cantor.

- **HiBy FD5 (Desktop-class DAC and amplifier)**: Tested with FD5 on low gain and class A amplifier, I found the FD5 and R6 Pro Max trade blows in soundstage size. FD5's stage is slightly larger and more open. The perceived bass power is similar, but FD5 lacks the incisiveness of transients, resulting in a less pitch black background and more "analog" sounding presentation.

- **iBasso DX300 (Flagship-class DAP)**: With medium gain and no oversampling, the DX300 trades blows with the R6 Pro Max in soundstage size. It also matches in bass power, control, and detail retrieval. Where the R6 Pro Max shines is in dynamics and the pitch black background, delivering a more exciting listening experience.


Concluding Remarks
===

![](/assets/images/R6-Pro-Max/R6ProMax_24.jpg)

Back to the question posed at the beginning of this article: what makes a DAP good? To me, a DAP is "good" when it has long battery, when its software does not get in the way of music enjoyment, and when its sound is "good enough." Generally, "good enough" means a DAP does not get in the way of my IEM too much compared to the DAC and amplifier sitting at my desk. However, once in a while, I come across a portable devices that make noticeable differences, to lift my IEM just a step beyond what the sound I am familiar with. After three months of testing, I am confident to put R6 Pro Max in this group of rare devices. I like how this DAP makes my familiar IEMs a bit more lively, a bit more impressive. The larger battery, better screen, and strong suite of DSP software complete the package, making a box of musical joy. 

What I like about this device: 

- Design, machining, and build quality
- The screen
- The battery, especially the standby and off time
- The software suite, especially the new PEQ software
- The sense of dynamic
- Pitch black background leading to a holographic soundstage
- Bass power and control
- Detail retrieval

What could be improved:

- Latency in USB DAC mode
- Get warm when playing music
- The size and weight could be a concern for some users
- Moving to Snapdragon Gen 3 or Elite next time?

![](/assets/images/R6-Pro-Max/R6ProMax_Summary.jpg)
