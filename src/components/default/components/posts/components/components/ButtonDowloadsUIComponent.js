import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { Component } from 'react';
import FACTORY from '../../../../../../common/FACTORY';
import { Apis } from '../../../../../../common/utils/Apis'

class ButtonDowloadsUIComponent extends Component {
  constructor(props) {
    super(props);
    this.refBtnOpen = React.createRef();
    this.CoreUI = null;
    this.state = {
      isVslOne: false,
    }
  }

  initLibs = async () => {
    if (!this.CoreUI)
      this.CoreUI = await FACTORY.GET_CORE_UI();
    if (!this.Pubs)
      this.Pubs = await FACTORY.GET_PUBLIC_MODULES();
  }

  async loadIsVslOne() {
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    if (!userLoged) return;
    await this.initLibs();
    const dataRes = await this.Pubs.fun_get(
      Apis.API_HOST + Apis.API_TAILER.POST + 'get/is-vsl-one',
      this.Pubs.fun_getConfigBearerDefault({}),
    );
    if (!dataRes.success) return;
    this.setState({ isVslOne: dataRes.data });
  }

  componentDidMount() {
    this.loadIsVslOne();
  }

  promoUI() {
    return (
      <div>
        {/* Button trigger modal */}
        <button
          ref={(ref) => this.refBtnOpen = ref}
          type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#promo-modal-event">
          promo events
        </button>
        {/* Modal */}
        <div className="modal fade" id="promo-modal-event" tabIndex={-1} aria-labelledby="promo-modal-eventLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-promo">
            <div className="modal-content">
              <div className="modal-header bg-white">
                <h5 className="modal-title text-dark">
                  Tham gia nhóm trên Facebook.
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body modal-body-promo">
                <a href="https://www.facebook.com/groups/myhufier.all.in.one/?ref=web_social_plugin" target="blank">
                  <img alt='join-group-facebook' src="/image/images/group-facebook.png" className="w-100" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  showPromo = async (e) => {
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    await this.initLibs();
    // rem login with download
    // if (!userLoged) {
    //   e.preventDefault();
    //   await this.CoreUI.fun_showConfirm({
    //     title: 'Cần đăng nhập để download!',
    //     message: 'Để thực hiện hành động download bạn cần đăng nhập trước. [ nút đăng nhập ở góc phía trên, bên phải màn hình ] mẹo: đăng nhập bằng google hay facebook cho nó nhanh.',
    //   });
    //   const btnLogin = document.getElementById('btnLogin');
    //   try {
    //     if (btnLogin) btnLogin.click();
    //   } catch { }
    //   return;
    // }

    try {
      if (this.refBtnOpen)
        this.refBtnOpen.click();
    } catch { }
    this.loadIsVslOne();
  }

  async btnFakeClickedAds() {
    const userLoged = FACTORY.fun_getUserLoginLocalStorage();
    await this.initLibs();
    // rem login with download
    // if (!userLoged) {
    //   await this.CoreUI.fun_showConfirm({
    //     title: 'Cần đăng nhập để download!',
    //     message: 'Để thực hiện hành động download bạn cần đăng nhập trước. [ nút đăng nhập ở góc phía trên, bên phải màn hình ] mẹo: đăng nhập bằng google hay facebook cho nó nhanh.',
    //   });
    //   return;
    // }
    const adsEl = document.getElementById('vsl-ads-one');
    if (!adsEl) return;
    const { x, y, width, height } = adsEl.getBoundingClientRect();
    const setX = x + (width / 2);
    const setY = y + (height / 2);
    if (setX >= 0 && setY >= 0) {
      this.handleDownloads(setX, setY);
      return;
    }
    adsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      this.handleDownloads(setX, height / 2);
    }, 1000);
  }

  async handleDownloads(x, y) {
    await this.insertUserClickAdsIntoDB();
    document.elementFromPoint(x, y).click();
  }

  async insertUserClickAdsIntoDB() {
    await this.Pubs.fun_post(
      Apis.API_HOST + Apis.API_TAILER.POST + 'post/is-vsl-one', {},
      this.Pubs.fun_getConfigBearerDefault({}),
    );
    this.loadIsVslOne();
  }

  getButtonsDownloadUI(links) {
    const list = FACTORY.fun_tryParseJSON(links) || [];
    if (list.length === 0) return <></>;
    return list.map((v, k) => {
      return (
        this.state.isVslOne ?
          <Button
            key={k}
            onClick={() => this.btnFakeClickedAds()}
            className='p-0 m-2' type='link' icon={<DownloadOutlined />}>
            {v.title}
          </Button> :
          <a
            onClick={(e) => this.showPromo(e)}
            className='m-2' key={k} href={v.link} target='blank'>
            <Button className='p-0' type='link' icon={<DownloadOutlined />}>
              {v.title}
            </Button>
          </a>
      );
    });
  }

  render() {
    const { links } = this.props;
    if (!links) return <></>;

    return (
      <>
        {this.promoUI()}
        {this.getButtonsDownloadUI(links)}
      </>
    );
  }
}

export default ButtonDowloadsUIComponent;