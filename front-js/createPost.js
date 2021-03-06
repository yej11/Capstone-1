import axios from 'axios';
import {backend} from './main';

export default class CreatePost {
    constructor() {
        this.title = document.querySelector('#title');
        this.content = document.querySelector('#content');
        this.file = document.querySelector('#file');
        this.button = document.querySelector('#postButton');
        this.events();
    }

    events() {
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            let error = false;

            const [category, token] = this.button.value.split(',AA,');

            if (['apply', 'pledge'].includes(category)) {
                const form = new FormData();

                form.append('title', this.title.value);
                form.append('content', this.content.value);

                if (this.file.files.length !== 0) {
                    [...this.file.files].forEach((f, i) => {
                        if (f.type.split('/')[0] === 'image') {
                            form.append('images', this.file.files[i]);
                        } else {
                            alert('이미지만 첨부 가능합니다.');
                            error = true;
                            return window.location.replace(
                                `/${category}/create`
                            );
                        }
                    });
                }

                if (!error) {
                    axios
                        .post(`${backend}/api/${category}`, form, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        })
                        .then((response) => {
                            alert('게시글 작성 완료');
                            window.location.replace(`/${category}`);
                        })
                        .catch((error) => {
                            alert('신청기간이나 입력값을 확인하세요');
                            console.log(error);
                            // window.location.replace(`/${category}/create`);
                        });
                }
            } else {
                const form = new FormData();

                form.append('title', this.title.value);
                form.append('content', this.content.value);
                form.append('category', category);

                if (this.file.files.length !== 0) {
                    [...this.file.files].forEach((f, i) => {
                        if (f.type.split('/')[0] === 'image') {
                            form.append('images', this.file.files[i]);
                        } else if (f.type.split('/')[0] === 'video') {
                            form.append('video', this.file.files[i]);
                        } else {
                            alert('이미지나 동영상만 첨부 가능합니다.');
                            error = true;
                            return window.location.replace(
                                `/${category}/create`
                            );
                        }
                    });
                }

                if (!error) {
                    axios
                        .post(`${backend}/api/post`, form, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        })
                        .then((response) => {
                            alert('게시글 작성 완료');
                            window.location.replace(`/${category}`);
                        })
                        .catch((error) => {
                            alert('입력값을 확인하세요');
                            window.location.replace(`/${category}/create`);
                            console.log(error.message);
                        });
                }
            }
        });
    }
}
