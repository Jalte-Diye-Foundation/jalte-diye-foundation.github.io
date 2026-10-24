(function () {
    const list = document.getElementById('blog-list');
    if (!list) return;
    const search = document.getElementById('blog-search');
    const select = document.getElementById('blog-category');
    const status = document.getElementById('blog-status');
    let posts = [];

    function formatDate(iso) {
        const d = new Date(iso + 'T00:00:00');
        if (isNaN(d)) return '';
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function render() {
        const q = search.value.trim().toLowerCase();
        const cat = select.value;
        const shown = posts.filter(function (p) {
            if (cat && p.category !== cat) return false;
            return !q || (p.title + ' ' + (p.excerpt || '')).toLowerCase().indexOf(q) !== -1;
        });

        list.textContent = '';
        shown.forEach(function (p) {
            const card = document.createElement('article');
            card.className = 'blog-card';

            const meta = [];
            if (p.date && formatDate(p.date)) meta.push(formatDate(p.date));
            if (p.category) meta.push(p.category);
            if (meta.length) {
                const m = document.createElement('p');
                m.className = 'blog-meta';
                m.textContent = meta.join(' \u2022 ');
                card.appendChild(m);
            }

            const h = document.createElement('h4');
            h.className = 'blog-title';
            h.textContent = p.title;
            card.appendChild(h);

            if (p.excerpt) {
                const e = document.createElement('p');
                e.className = 'blog-excerpt';
                e.textContent = p.excerpt;
                card.appendChild(e);
            }

            const id = postId(p);
            if (id) card.id = id;

            const actions = document.createElement('div');
            actions.className = 'blog-actions';

            if (p.url) {
                const a = document.createElement('a');
                a.className = 'learn-more-link';
                a.href = p.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = 'View on LinkedIn';
                a.setAttribute('aria-label', 'View on LinkedIn: ' + p.title);
                actions.appendChild(a);
            }

            if (id) {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'blog-share-btn';
                b.textContent = 'Share';
                b.setAttribute('aria-label', 'Copy share link for: ' + p.title);
                b.addEventListener('click', function () { share(p, id, b); });
                actions.appendChild(b);
            }

            card.appendChild(actions);
            list.appendChild(card);
        });

        status.textContent = shown.length + (shown.length === 1 ? ' post' : ' posts');
    }

    function postId(p) {
        const m = /activity:(\d+)/.exec(p.url || '');
        return m ? 'post-' + m[1] : '';
    }

    function shareUrl(id) {
        return location.origin + location.pathname + '#' + id;
    }

    function share(p, id, btn) {
        const url = shareUrl(id);
        const done = function (msg) {
            btn.textContent = msg;
            setTimeout(function () { btn.textContent = 'Share'; }, 2000);
        };
        const fallback = function () {
            const t = document.createElement('textarea');
            t.value = url;
            t.setAttribute('readonly', '');
            t.style.position = 'fixed';
            t.style.opacity = '0';
            document.body.appendChild(t);
            t.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(t);
            if (ok) done('Link copied!'); else window.prompt('Copy this link:', url);
        };
        const copied = (navigator.clipboard && navigator.clipboard.writeText)
            ? navigator.clipboard.writeText(url).then(function () { return true; }, function () { return false; })
            : Promise.resolve(false);

        if (navigator.share) {
            navigator.share({ title: p.title, url: url }).catch(function () {});
            copied.then(function (ok) { if (ok) done('Link copied!'); });
            return;
        }
        copied.then(function (ok) { if (ok) done('Link copied!'); else fallback(); });
    }

    function focusLinkedPost() {
        const id = location.hash.slice(1);
        if (!id || id.indexOf('post-') !== 0) return;
        let el = document.getElementById(id);
        if (!el) {
            search.value = '';
            select.value = '';
            render();
            el = document.getElementById(id);
        }
        if (el) {
            el.classList.add('blog-card--linked');
            el.scrollIntoView({ block: 'center' });
        }
    }

    fetch('blog-posts.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            posts = data;
            const cats = Array.from(new Set(posts.map(function (p) { return p.category; }).filter(Boolean))).sort();
            cats.forEach(function (c) {
                const o = document.createElement('option');
                o.value = c;
                o.textContent = c;
                select.appendChild(o);
            });
            render();
            focusLinkedPost();
        })
        .catch(function () {
            status.textContent = 'Posts could not be loaded right now. Please visit our LinkedIn page.';
        });

    search.addEventListener('input', render);
    select.addEventListener('change', render);
})();
