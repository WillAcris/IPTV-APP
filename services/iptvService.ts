import type { Channel } from '../types';

const rawChannelData = `[Esportes]
Amazon Prime Video
Logo: https://embedcanais.com/images/amazonprimevideo.png
Iframe:
<iframe src="https://embedcanais.com/amazonprimevideo/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Band Sports
Logo: https://embedcanais.com/images/bandsports.png
Iframe:
<iframe src="https://embedcanais.com/bandsports/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Canal Off
Logo: https://embedcanais.com/images/canaloff.png
Iframe:
<iframe src="https://embedcanais.com/canaloff/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
CazéTV
Logo: https://embedcanais.com/images/cazetv.png
Iframe:
<iframe src="https://embedcanais.com/cazetv/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Combate
Logo: https://embedcanais.com/images/combate.png
Iframe:
<iframe src="https://embedcanais.com/combate/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
DAZN
Logo: https://embedcanais.com/images/dazn.png
Iframe:
<iframe src="https://embedcanais.com/dazn/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Disney+
Logo: https://embedcanais.com/images/disneyplus.png
Iframe:
<iframe src="https://embedcanais.com/disneyplus/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
ESPN
Logo: https://embedcanais.com/images/espn.png
Iframe:
<iframe src="https://embedcanais.com/espn/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
ESPN 2
Logo: https://embedcanais.com/images/espn.png
Iframe:
<iframe src="https://embedcanais.com/espn2/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
ESPN 3
Logo: https://embedcanais.com/images/espn.png
Iframe:
<iframe src="https://embedcanais.com/espn3/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
ESPN 4
Logo: https://embedcanais.com/images/espn.png
Iframe:
<iframe src="https://embedcanais.com/espn4/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
ESPN 5
Logo: https://embedcanais.com/images/espn.png
Iframe:
<iframe src="https://embedcanais.com/espn5/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
ESPN 6
Logo: https://embedcanais.com/images/espn.png
Iframe:
<iframe src="https://embedcanais.com/espn6/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Max
Logo: https://embedcanais.com/images/max.png
Iframe:
<iframe src="https://embedcanais.com/max/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Nosso Futebol
Logo: https://embedcanais.com/images/nossofutebol.png
Iframe:
<iframe src="https://embedcanais.com/nossofutebol/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
N Sports
Logo: https://embedcanais.com/images/nsports.png
Iframe:
<iframe src="https://embedcanais.com/nsports/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Paramount +
Logo: https://embedcanais.com/images/paramountplus.png
Iframe:
<iframe src="https://embedcanais.com/paramountplus/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Premiere Clubes
Logo: https://embedcanais.com/images/premiere.png
Iframe:
<iframe src="https://embedcanais.com/premiereclubes/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Premiere 2
Logo: https://embedcanais.com/images/premiere.png
Iframe:
<iframe src="https://embedcanais.com/premiere2/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Premiere 3
Logo: https://embedcanais.com/images/premiere.png
Iframe:
<iframe src="https://embedcanais.com/premiere3/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Premiere 4
Logo: https://embedcanais.com/images/premiere.png
Iframe:
<iframe src="https://embedcanais.com/premiere4/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Premiere 5
Logo: https://embedcanais.com/images/premiere.png
Iframe:
<iframe src="https://embedcanais.com/premiere5/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Premiere 6
Logo: https://embedcanais.com/images/premiere.png
Iframe:
<iframe src="https://embedcanais.com/premiere6/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Premiere 7
Logo: https://embedcanais.com/images/premiere.png
Iframe:
<iframe src="https://embedcanais.com/premiere7/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Premiere 8
Logo: https://embedcanais.com/images/premiere.png
Iframe:
<iframe src="https://embedcanais.com/premiere8/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
SporTV
Logo: https://embedcanais.com/images/sportv.png
Iframe:
<iframe src="https://embedcanais.com/sportv/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
SporTV 2
Logo: https://embedcanais.com/images/sportv2.png
Iframe:
<iframe src="https://embedcanais.com/sportv2/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
SporTV 3
Logo: https://embedcanais.com/images/sportv3.png
Iframe:
<iframe src="https://embedcanais.com/sportv3/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
TNT
Logo: https://embedcanais.com/images/tnt1.png
Iframe:
<iframe src="https://embedcanais.com/tnt/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
UFC Fight Pass
Logo: https://embedcanais.com/images/ufcfightpass.png
Iframe:
<iframe src="https://embedcanais.com/ufcfightpass/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Esportes]
Xsports
Logo: https://embedcanais.com/images/xsports.png
Iframe:
<iframe src="https://embedcanais.com/xsports/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
A&E
Logo: https://embedcanais.com/images/aee.png
Iframe:
<iframe src="https://embedcanais.com/aee/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
AMC
Logo: https://embedcanais.com/images/amc.png
Iframe:
<iframe src="https://embedcanais.com/amc/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
AXN
Logo: https://embedcanais.com/images/axn.png
Iframe:
<iframe src="https://embedcanais.com/axn/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Cinemax
Logo: https://embedcanais.com/images/cinemax.png
Iframe:
<iframe src="https://embedcanais.com/cinemax/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Globoplay Novelas
Logo: https://embedcanais.com/images/globoplaynovelas.png
Iframe:
<iframe src="https://embedcanais.com/globoplaynovelas/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
HBO
Logo: https://embedcanais.com/images/hbo.png
Iframe:
<iframe src="https://embedcanais.com/hbo/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
HBO 2
Logo: https://embedcanais.com/images/hbo2.png
Iframe:
<iframe src="https://embedcanais.com/hbo2/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
HBO Family
Logo: https://embedcanais.com/images/hbofamily.png
Iframe:
<iframe src="https://embedcanais.com/hbofamily/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
HBO Mundi
Logo: https://embedcanais.com/images/hbomundi.png
Iframe:
<iframe src="https://embedcanais.com/hbomundi/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
HBO Plus
Logo: https://embedcanais.com/images/hboplus.png
Iframe:
<iframe src="https://embedcanais.com/hboplus/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
HBO Pop
Logo: https://embedcanais.com/images/hbopop.png
Iframe:
<iframe src="https://embedcanais.com/hbopop/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
HBO Signature
Logo: https://embedcanais.com/images/hbosignature.png
Iframe:
<iframe src="https://embedcanais.com/hbosignature/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
HBO Xtreme
Logo: https://embedcanais.com/images/hboxtreme.png
Iframe:
<iframe src="https://embedcanais.com/hboxtreme/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Megapix
Logo: https://embedcanais.com/images/megapix.png
Iframe:
<iframe src="https://embedcanais.com/megapix/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Paramount Network
Logo: https://embedcanais.com/images/paramountnetwork.png
Iframe:
<iframe src="https://embedcanais.com/paramountnetwork/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Sony Channel
Logo: https://embedcanais.com/images/sonychannel.png
Iframe:
<iframe src="https://embedcanais.com/sonychannel/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Space
Logo: https://embedcanais.com/images/space.png
Iframe:
<iframe src="https://embedcanais.com/space/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Studio Universal
Logo: https://embedcanais.com/images/studiouniversal.png
Iframe:
<iframe src="https://embedcanais.com/studiouniversal/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Telecine Action
Logo: https://embedcanais.com/images/tcaction.png
Iframe:
<iframe src="https://embedcanais.com/tcaction/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Telecine Cult
Logo: https://embedcanais.com/images/tccult.png
Iframe:
<iframe src="https://embedcanais.com/tccult/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Telecine Fun
Logo: https://embedcanais.com/images/tcfun.png
Iframe:
<iframe src="https://embedcanais.com/tcfun/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Telecine Pipoca
Logo: https://embedcanais.com/images/tcpipoca.png
Iframe:
<iframe src="https://embedcanais.com/tcpipoca/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Telecine Premium
Logo: https://embedcanais.com/images/tcpremium.png
Iframe:
<iframe src="https://embedcanais.com/tcpremium/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Telecine Touch
Logo: https://embedcanais.com/images/tctouch.png
Iframe:
<iframe src="https://embedcanais.com/tctouch/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
TNT
Logo: https://embedcanais.com/images/tnt1.png
Iframe:
<iframe src="https://embedcanais.com/tnt/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
TNT Novelas
Logo: https://embedcanais.com/images/tntnovelas.png
Iframe:
<iframe src="https://embedcanais.com/tntnovelas/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
TNT Series
Logo: https://embedcanais.com/images/tntseries.png
Iframe:
<iframe src="https://embedcanais.com/tntseries/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Universal TV
Logo: https://embedcanais.com/images/universaltv.png
Iframe:
<iframe src="https://embedcanais.com/universaltv/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Filmes e Séries]
Warner Channel
Logo: https://embedcanais.com/images/warner.png
Iframe:
<iframe src="https://embedcanais.com/warner/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
Band SP
Logo: https://embedcanais.com/images/bandsp.png
Iframe:
<iframe src="https://embedcanais.com/bandsp/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
Globo MG
Logo: https://embedcanais.com/images/globo.webp
Iframe:
<iframe src="https://embedcanais.com/globomg/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
Globo RJ
Logo: https://embedcanais.com/images/globo.webp
Iframe:
<iframe src="https://embedcanais.com/globorj/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
Globo RS
Logo: https://embedcanais.com/images/globo.webp
Iframe:
<iframe src="https://embedcanais.com/globors/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
Globo SP
Logo: https://embedcanais.com/images/globo.webp
Iframe:
<iframe src="https://embedcanais.com/globosp/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
Record MG
Logo: https://embedcanais.com/images/record.png
Iframe:
<iframe src="https://embedcanais.com/recordmg/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
Record RJ
Logo: https://embedcanais.com/images/record.png
Iframe:
<iframe src="https://embedcanais.com/recordrj/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
Record SP
Logo: https://embedcanais.com/images/record.png
Iframe:
<iframe src="https://embedcanais.com/recordsp/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
RedeTV!
Logo: https://embedcanais.com/images/redetv.png
Iframe:
<iframe src="https://embedcanais.com/redetv/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
SBT SP
Logo: https://embedcanais.com/images/sbtsp.png
Iframe:
<iframe src="https://embedcanais.com/sbtsp/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Canais Abertos]
TV Cultura
Logo: https://embedcanais.com/images/tvcultura.png
Iframe:
<iframe src="https://embedcanais.com/tvcultura/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Adult Swim
Logo: https://embedcanais.com/images/adultswim.png
Iframe:
<iframe src="https://embedcanais.com/adultswim/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Animal Planet
Logo: https://embedcanais.com/images/animalplanet.png
Iframe:
<iframe src="https://embedcanais.com/animalplanet/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Comedy Central
Logo: https://embedcanais.com/images/comedycentral.png
Iframe:
<iframe src="https://embedcanais.com/comedycentral/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Discovery Channel
Logo: https://embedcanais.com/images/discoverychannel.png
Iframe:
<iframe src="https://embedcanais.com/discoverychannel/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Discovery Home & Health
Logo: https://embedcanais.com/images/discoveryhh.png
Iframe:
<iframe src="https://embedcanais.com/discoveryhh/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Investigation Discovery
Logo: https://embedcanais.com/images/discoveryid.png
Iframe:
<iframe src="https://embedcanais.com/discoveryid/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Discovery Science
Logo: https://embedcanais.com/images/discoveryscience.png
Iframe:
<iframe src="https://embedcanais.com/discoveryscience/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Discovery Theater
Logo: https://embedcanais.com/images/discoverytheater.png
Iframe:
<iframe src="https://embedcanais.com/discoverytheater/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Discovery Turbo
Logo: https://embedcanais.com/images/discoveryturbo.png
Iframe:
<iframe src="https://embedcanais.com/discoveryturbo/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Discovery World
Logo: https://embedcanais.com/images/discoveryworld.png
Iframe:
<iframe src="https://embedcanais.com/discoveryworld/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Food Network
Logo: https://embedcanais.com/images/foodnetwork.png
Iframe:
<iframe src="https://embedcanais.com/foodnetwork/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
GNT
Logo: https://embedcanais.com/images/gnt.png
Iframe:
<iframe src="https://embedcanais.com/gnt/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
HGTV
Logo: https://embedcanais.com/images/hgtv.png
Iframe:
<iframe src="https://embedcanais.com/hgtv/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
History
Logo: https://embedcanais.com/images/history.png
Iframe:
<iframe src="https://embedcanais.com/history/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
History 2
Logo: https://embedcanais.com/images/history2.png
Iframe:
<iframe src="https://embedcanais.com/history2/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
MTV
Logo: https://embedcanais.com/images/mtv.png
Iframe:
<iframe src="https://embedcanais.com/mtv/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Variedades]
Multishow
Logo: https://embedcanais.com/images/multishow.png
Iframe:
<iframe src="https://embedcanais.com/multishow/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Reality Show]
A Fazenda CAM 01
Logo: https://embedcanais.com/images/afazenda.webp
Iframe:
<iframe src="https://embedcanais.com/afazenda01/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Reality Show]
A Fazenda CAM 02
Logo: https://embedcanais.com/images/afazenda.webp
Iframe:
<iframe src="https://embedcanais.com/afazenda02/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Reality Show]
A Fazenda CAM 03
Logo: https://embedcanais.com/images/afazenda.webp
Iframe:
<iframe src="https://embedcanais.com/afazenda03/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Reality Show]
A Fazenda CAM 04
Logo: https://embedcanais.com/images/afazenda.webp
Iframe:
<iframe src="https://embedcanais.com/afazenda04/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Reality Show]
A Fazenda CAM 05
Logo: https://embedcanais.com/images/afazenda.webp
Iframe:
<iframe src="https://embedcanais.com/afazenda05/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Reality Show]
A Fazenda CAM 06
Logo: https://embedcanais.com/images/afazenda.webp
Iframe:
<iframe src="https://embedcanais.com/afazenda06/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Notícias]
BandNews
Logo: https://embedcanais.com/images/bandnews.png
Iframe:
<iframe src="https://embedcanais.com/bandnews/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Notícias]
CNN Brasil
Logo: https://embedcanais.com/images/cnnbrasil.png
Iframe:
<iframe src="https://embedcanais.com/cnnbrasil/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Notícias]
GloboNews
Logo: https://embedcanais.com/images/globonews.png
Iframe:
<iframe src="https://embedcanais.com/globonews/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Notícias]
Jovem Pan News
Logo: https://embedcanais.com/images/jovempannews.png
Iframe:
<iframe src="https://embedcanais.com/jovempannews/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Notícias]
Record News
Logo: https://embedcanais.com/images/recordnews.png
Iframe:
<iframe src="https://embedcanais.com/recordnews/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
Cartoonito
Logo: https://embedcanais.com/images/cartoonito.png
Iframe:
<iframe src="https://embedcanais.com/cartoonito/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
Cartoon Network
Logo: https://embedcanais.com/images/cartoonnetwork.png
Iframe:
<iframe src="https://embedcanais.com/cartoonnetwork/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
Discovery Kids
Logo: https://embedcanais.com/images/discoverykids.png
Iframe:
<iframe src="https://embedcanais.com/discoverykids/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
DreamWorks
Logo: https://embedcanais.com/images/dreamworks.png
Iframe:
<iframe src="https://embedcanais.com/dreamworks/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
Gloob
Logo: https://embedcanais.com/images/gloob.png
Iframe:
<iframe src="https://embedcanais.com/gloob/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
Gloobinho
Logo: https://embedcanais.com/images/gloobinho.png
Iframe:
<iframe src="https://embedcanais.com/gloobinho/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
Nickelodeon
Logo: https://embedcanais.com/images/nickelodeon.png
Iframe:
<iframe src="https://embedcanais.com/nickelodeon/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
Nick Jr.
Logo: https://embedcanais.com/images/nickjr.png
Iframe:
<iframe src="https://embedcanais.com/nickjr/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>

[Infantil]
Tooncast
Logo: https://embedcanais.com/images/tooncast.png
Iframe:
<iframe src="https://embedcanais.com/tooncast/" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>
`;

const parseChannels = (data: string): Channel[] => {
  const channels: Channel[] = [];
  const blocks = data.trim().split(/\n\s*\n/);
  let idCounter = 1;

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 4) continue;

    try {
      const categoryMatch = lines[0].match(/\[(.*?)\]/);
      const group = categoryMatch ? categoryMatch[1].trim() : 'Uncategorized';
      
      const name = lines[1].trim();
      
      const logoMatch = lines[2].match(/Logo: (.*)/);
      const logo = logoMatch ? logoMatch[1].trim() : '';
      
      const iframeContent = lines.slice(3).join(' ');
      let url = '';
      
      // Regular expression to find a properly quoted src attribute
      const urlMatch = iframeContent.match(/src="([^"]+)"/);
      if (urlMatch) {
        url = urlMatch[1];
      } else {
        // Fallback for malformed src attribute without a closing quote (e.g., SporTV 2 case)
        const malformedUrlMatch = iframeContent.match(/src="([^"\s]+)/);
        if (malformedUrlMatch) {
            url = malformedUrlMatch[1];
        }
      }

      if (name && logo && url) {
        channels.push({
          id: String(idCounter++),
          name,
          logo,
          url,
          group,
        });
      }
    } catch (e) {
      console.error("Failed to parse block:", block, e);
    }
  }
  return channels;
};

const channelsFromData = parseChannels(rawChannelData);

export const getChannels = (): Promise<Channel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(channelsFromData);
    }, 500); // Simulate network delay
  });
};
