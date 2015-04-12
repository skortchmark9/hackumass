
    ______ ______                                  __            _  __     __
   / ____// ____/____ ___   ____   ___   ____ _   / /_   __  __ (_)/ /____/ /
  / /_   / /_   / __ `__ \ / __ \ / _ \ / __ `/  / __ \ / / / // // // __  / 
 / __/  / __/  / / / / / // /_/ //  __// /_/ /  / /_/ // /_/ // // // /_/ /  
/_/    /_/    /_/ /_/ /_// .___/ \___/ \__, /  /_.___/ \__,_//_//_/ \__,_/   
                        /_/           /____/                                 


                build: ffmpeg-2.6.2-32bit-static.tar.xz
              version: 2.6.2
 
                  gcc: 4.9.2
                 yasm: 1.3.0

               libass: 0.12.1
               libvpx: 1.4.0-140-g2f693be
              libx264: 0.146.61 121396c
              libx265: 1.6+172-43d33281f769
              libxvid: 1.3.3-1
              libwebp: 0.4.3
            libgnutls: 3.2.21
            libtheora: 1.1.1
           libvidstab: 1.0
          libfreetype: 2.5.2-4
          libopenjpeg: 1.5.2 

              libsoxr: 0.1.1
              libopus: 1.1-2
             libspeex: 1.2
            libvorbis: 1.3.4-2
           libmp3lame: 3.99.5
         libvo-aacenc: 0.1.3-1
       libvo-amrwbenc: 0.1.3-1
    libopencore-amrnb: 0.1.3-2.1
    libopencore-amrwb: 0.1.3-2.1

      For HEVC/H.265 encoding:  ffmpeg -h encoder=libx265
                                http://x265.readthedocs.org/en/default/cli.html#standalone-executable-options

      For AVC/H.264 encoding:   ffmpeg -h encoder=libx264
                                http://mewiki.project357.com/wiki/X264_Settings

                 FFmpeg Wiki:   https://trac.ffmpeg.org/wiki


      Notes: ffmpeg-10bit is built with 10-bit AVC/H.264 encoding support.

             A limitation of statically linking glibc is the loss of DNS resolution. Installing
             nscd through your package manager will fix this or you can use
             "ffmpeg -i http://<ip address here>/" instead of "ffmpeg -i http://example.com/"


      I recently had to upgrade my hosting plan to handle the amount of traffic from FFmpeg downloads.
      If you appreciate this up-to-date build of FFmpeg and my time that goes into to maintaining it,
      please consider making a donation. Thank you.

      * You don't need a Paypal account to make a one time donation, just fill out your credit/debit 
        card info on the bottom left of the Paypal page.
      
      Paypal tinyurl: http://goo.gl/1Ol8N

      email: john.vansickle@gmail.com
      irc: relaxed @ irc://irc.freenode.net #ffmpeg
      url: http://johnvansickle.com/ffmpeg/
