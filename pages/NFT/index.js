import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Container, Typography, Grid, Button } from "@mui/material";
import useStore from "../../store/store";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Zoom } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import styles from "./nft.module.css";

const NFT = () => {
  const { isConnected, wallet, setNftCollection, nftCollection } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    getEthNft();
  }, []);

  const getEthNft = () => {
    if (isConnected && nftCollection.length === 0) {
      const options = {
        method: "GET",
        headers: { Accept: "application/json" },
      };
      fetch(
        `https://testnets-api.opensea.io/api/v1/assets?owner=${wallet.address}&offset=0&limit=50`,
        options
      )
        .then(res => res.json())
        .then(res => {
          setNftCollection(res.assets);
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <Container
      sx={{
        mt: "50px",
        overflow: "hidden",
      }}
    >
      <Grid conatiner justifyContent="center">
        {nftCollection && nftCollection.length !== 0 ? (
          <>
            <Typography>Your Nft on OpenSea.io</Typography>
            <div className={styles.nft_slide}>
              <Swiper
                effect={"coverflow"}
                style={{
                  "--swiper-navigation-color": "#673ab7",
                  "--swiper-pagination-color": "#673ab7",
                }}
                zoom={true}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Zoom]}
                onSlideChange={e => setCurrentSlide(e.realIndex)}
                className={styles.swiper}
              >
                {nftCollection.map((nft, index) => (
                  <>
                    <SwiperSlide key={index}>
                      <Image
                        src={nft.image_url}
                        alt={nft.name}
                        height={400}
                        width={400}
                      />
                    </SwiperSlide>
                  </>
                ))}
              </Swiper>
              <Grid sx={{ pt: 3 }}>
                <Button variant="contained" color="primary">
                  <a
                    href={nftCollection[currentSlide].permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View or Sell
                  </a>
                </Button>
              </Grid>
            </div>
          </>
        ) : (
          <>
            <Typography>No NFT Found </Typography>
            <div className={styles.nft_slide}>
              <Grid sx={{ pt: 3 }}>
                <Button variant="contained" color="primary">
                  <a
                    href="https://testnets.opensea.io/asset/create"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mint Nft
                  </a>
                </Button>
              </Grid>
            </div>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default NFT;
