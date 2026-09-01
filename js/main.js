/**
 * Billmat LLC — main.js
 * Shared behavior for all pages: mobile nav, dark mode, back-to-top,
 * table sorting, and lightweight form handling.
 * No external dependencies.
 */
(function () {
  'use strict';

  // ---------- Dark mode ----------
  var THEME_KEY = 'billmat-theme';
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    var preferred = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(preferred);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
      });
    }
  }

  // ---------- Back to top ----------
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Sortable tables ----------
  function initSortableTables() {
    var tables = document.querySelectorAll('table[data-sortable]');
    tables.forEach(function (table) {
      var headers = table.querySelectorAll('thead th');
      headers.forEach(function (th, index) {
        th.classList.add('sortable');
        th.setAttribute('tabindex', '0');
        th.setAttribute('role', 'button');
        var sortDir = null;

        // Extracts a representative number from a cell for sorting.
        // Ranges like "10-30 days" or "$5-$25" use the average of the
        // numbers found rather than just the first (lower) value, so
        // that ranges compare more sensibly against single values.
        function numericValue(text) {
          var matches = text.match(/-?\d+(\.\d+)?/g);
          if (!matches) return NaN;
          var nums = matches.map(parseFloat);
          var sum = nums.reduce(function (a, b) { return a + b; }, 0);
          return sum / nums.length;
        }

        function sort() {
          var tbody = table.querySelector('tbody');
          var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
          rows.sort(function (a, b) {
            var aText = a.children[index].textContent.trim().toLowerCase();
            var bText = b.children[index].textContent.trim().toLowerCase();
            var aNum = numericValue(aText);
            var bNum = numericValue(bText);
            var cmp;
            if (!isNaN(aNum) && !isNaN(bNum)) {
              cmp = aNum - bNum;
            } else {
              cmp = aText.localeCompare(bText);
            }
            return sortDir === 'asc' ? cmp : -cmp;
          });
          rows.forEach(function (row) { tbody.appendChild(row); });
        }
        th.addEventListener('click', sort);
        th.addEventListener('keypress', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); }
        });
      });
    });
  }

  // ---------- Newsletter / contact forms (no backend — client-side confirmation only) ----------
  function initSimpleForms() {
    var forms = document.querySelectorAll('form[data-noop-form]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var success = form.querySelector('.form-success');
        if (success) {
          success.classList.add('show');
        }
        form.reset();
      });
    });
  }

  // ---------- 12-month payment cost calculator ----------
  function initCalculator() {
    var form = document.getElementById('cost-calculator');
    if (!form) return;

    function currency(n) {
      return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
      var premium = parseFloat(document.getElementById('calc-premium').value) || 0;
      var installmentFee = parseFloat(document.getElementById('calc-fee').value) || 0;

      // Pay in full: up to 15% discount, no installment fees.
      var payInFullDiscount = premium * 0.15;
      var payInFullTotal = premium - payInFullDiscount;

      // Monthly, no AutoPay: 11 installment fees typically applied (first payment has none in many states).
      var monthlyInstallments = 11;
      var monthlyTotal = premium + (installmentFee * monthlyInstallments);

      // Monthly + AutoPay: up to 15% discount, no installment fees.
      var autopayDiscount = premium * 0.15;
      var autopayTotal = premium - autopayDiscount;

      var results = [
        { id: 'result-full', total: payInFullTotal, note: 'Saves ' + currency(payInFullDiscount) + ' vs. sticker premium' },
        { id: 'result-monthly', total: monthlyTotal, note: 'Adds ' + currency(installmentFee * monthlyInstallments) + ' in fees over 11 installments' },
        { id: 'result-autopay', total: autopayTotal, note: 'Saves ' + currency(autopayDiscount) + ', no installment fees' }
      ];

      var totals = results.map(function (r) { return r.total; });
      var lowest = Math.min.apply(null, totals);

      results.forEach(function (r) {
        var el = document.getElementById(r.id);
        if (!el) return;
        el.querySelector('.amount').textContent = currency(r.total);
        el.querySelector('.note').textContent = r.note;
        el.classList.toggle('best', r.total === lowest);
        var badge = el.querySelector('.badge');
        if (badge) badge.style.display = r.total === lowest ? 'inline-block' : 'none';
      });

      document.getElementById('calc-results-wrap').style.display = 'grid';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculate();
    });
  }

  // ---------- Decision tree ----------
  function initDecisionTree() {
    var form = document.getElementById('decision-tree-form');
    if (!form) return;
    var resultBox = document.getElementById('decision-result');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var speed = data.get('speed');
      var automation = data.get('automation');
      var discount = data.get('discount');
      var tech = data.get('tech');

      var recommendation = '';
      var reasoning = [];

      if (automation === 'yes' && discount === 'yes') {
        recommendation = 'AutoPay (automatic payments)';
        reasoning.push('You want automation and discounts — AutoPay is the only method that reliably delivers both, with up to 15% off and zero missed-payment risk.');
      } else if (speed === 'urgent' && tech === 'low') {
        recommendation = 'Phone payment (automated line or live agent)';
        reasoning.push('You need speed but prefer not to use apps or websites — Progressive\'s phone payment line processes same-day and doesn\'t require an online account.');
      } else if (speed === 'urgent' && tech !== 'low') {
        recommendation = 'Quick Pay without login (credit/debit card or bank transfer)';
        reasoning.push('You need speed and are comfortable online — quick pay processes fast without requiring you to remember a password.');
      } else if (tech === 'high' && discount !== 'yes') {
        recommendation = 'Mobile app payment';
        reasoning.push('You are comfortable with technology and don\'t need to prioritize discounts — the app gives you full control, digital ID cards, and payment history.');
      } else if (tech === 'low') {
        recommendation = 'Mail payment (check or money order)';
        reasoning.push('You prefer traditional methods — mailing a check remains fully supported, though it is the slowest option and requires planning around grace periods.');
      } else {
        recommendation = 'Online card, PayPal, or bank transfer payment';
        reasoning.push('Based on your answers, a standard online payment gives you the best balance of speed, control, and simplicity without committing to automatic billing.');
      }

      resultBox.textContent = '';
      var heading = document.createElement('h3');
      heading.textContent = 'Recommended: ' + recommendation;
      var body = document.createElement('p');
      body.textContent = reasoning.join(' ');
      resultBox.appendChild(heading);
      resultBox.appendChild(body);
      resultBox.classList.add('show');
      resultBox.setAttribute('tabindex', '-1');
      resultBox.focus();
    });
  }

  // ---------- Grace period checker ----------
  var GRACE_DATA = {
    'Arizona': { range: '10-15 days', fee: '$10' },
    'California': { range: '10 days', fee: '$10' },
    'Florida': { range: '10-14 days', fee: '$15' },
    'Georgia': { range: '10 days', fee: '$10' },
    'Illinois': { range: '7-10 days', fee: '$10' },
    'New York': { range: '15-30 days', fee: '$10-$25' },
    'Ohio': { range: '10-14 days', fee: '$10' },
    'Pennsylvania': { range: '10 days', fee: '$10' },
    'Texas': { range: '10-14 days', fee: '$5-$10' },
    'Washington': { range: '10-20 days', fee: '$10' }
  };

  function initGraceChecker() {
    var select = document.getElementById('grace-state-select');
    if (!select) return;
    var resultBox = document.getElementById('grace-result');

    Object.keys(GRACE_DATA).sort().forEach(function (state) {
      var opt = document.createElement('option');
      opt.value = state;
      opt.textContent = state;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      var state = select.value;
      if (!state || !GRACE_DATA[state]) {
        resultBox.classList.remove('show');
        return;
      }
      var data = GRACE_DATA[state];
      resultBox.textContent = '';

      var stateStrong = document.createElement('strong');
      stateStrong.textContent = state + ':';
      var rangeStrong = document.createElement('strong');
      rangeStrong.textContent = data.range;
      var feeStrong = document.createElement('strong');
      feeStrong.textContent = data.fee;

      resultBox.appendChild(stateStrong);
      resultBox.appendChild(document.createTextNode(' Typical grace period is '));
      resultBox.appendChild(rangeStrong);
      resultBox.appendChild(document.createTextNode(' during the policy term, with late fees around '));
      resultBox.appendChild(feeStrong);
      resultBox.appendChild(document.createTextNode(
        '. This is an illustrative range for planning purposes \u2014 confirm your exact grace period and ' +
        'fee with Progressive using your declarations page or online account, since it can vary by policy ' +
        'and underwriting company.'
      ));
      resultBox.classList.add('show');
    });
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initBackToTop();
    initSortableTables();
    initSimpleForms();
    initCalculator();
    initDecisionTree();
    initGraceChecker();

    // Footer year + last-updated auto stamp for elements requesting it
    document.querySelectorAll('[data-current-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
